"use server";

import { redirect } from "next/navigation";
import { productSchema } from "./shema";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/app/utils/supabase/get-user";
import { revalidatePath } from "next/cache";

export async function uploadPost(_: any, formData: FormData) {
  try {
    const data = {
      title: formData.get("title"),
      content: formData.get("content"),
    };

    const result = productSchema.safeParse(data);
    if (!result.success) {
      return {
        success: false,
        error: result.error.flatten(),
      };
    } else {
      const session = await getCurrentUser();

      if (!session?.fullAddress) {
        return {
          success: false,
          error: {
            formErrors: ["Please update your address."],
          },
        };
      }
      if (!session.id) {
        return {
          success: false,
          error: {
            formErrors: ["Please update your address."],
          },
        };
      }
      const post = await db.post.create({
        data: {
          title: result.data.title,
          description: result.data.content,
          user: {
            connect: {
              id: session!.id.toString(),
            },
          },
        },
        select: {
          id: true,
        },
      });

      revalidatePath("/user/community/posts");
      return {
        success: true,
        productId: post.id,
      };
    }
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
