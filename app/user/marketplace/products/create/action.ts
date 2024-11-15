"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { productSchema } from "./shema";
import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/app/utils/supabase/get-user";
export async function uploadProduct(_: any, formData: FormData) {
  try {
    const supabase = createClient();

    const data = {
      photos: formData.getAll("photos"),
      title: formData.get("title"),
      price: formData.get("price"),
      content: formData.get("content"),
    };

    // 이미지 업로드 처리
    const photoPaths: string[] = [];
    for (const photo of data.photos) {
      if (photo instanceof File) {
        const fileExt = photo.name.split(".").pop();
        const fileName = `${Date.now()}_${Math.random()
          .toString(36)
          .substring(7)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const photoBuffer = await photo.arrayBuffer();

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("products")
          .upload(filePath, photoBuffer, {
            contentType: photo.type,
            upsert: false,
          });

        if (uploadError) {
          throw new Error("Failed to upload image: " + uploadError.message);
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("products").getPublicUrl(filePath);

        photoPaths.push(publicUrl);
      }
    }

    data.photos = photoPaths;
    const result = productSchema.safeParse(data);

    if (!result.success) {
      return {
        success: false,
        error: result.error.flatten(),
      };
    }

    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user.id;
    const userAdress = await getCurrentUser();

    if (!userId) {
      return {
        success: false,
        error: {
          formErrors: ["인증이 필요합니다."],
        },
      };
    }
    if (!userAdress?.fullAddress) {
      return {
        success: false,
        error: {
          formErrors: ["Please update your address."],
        },
      };
    }

    const product = await db.product.create({
      data: {
        title: result.data.title,
        description: result.data.content,
        price: Number(result.data.price),
        photos: {
          createMany: {
            data: photoPaths.map((url) => ({ url })),
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
      select: {
        id: true,
      },
    });

    // 캐시 갱신
    revalidatePath("/user/marketplace/products");

    return {
      success: true,
      productId: product.id,
    };
  } catch (error) {
    console.error("Error in uploadProduct:", error);

    return {
      success: false,
      error: {
        formErrors: ["제품 업로드 중 오류가 발생했습니다."],
      },
    };
  }
}
