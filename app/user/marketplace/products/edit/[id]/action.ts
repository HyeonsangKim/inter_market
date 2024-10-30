"use server";

import { db } from "@/lib/db";
import { productSchema } from "../../create/shema";
import { revalidateTag } from "next/cache";
import { getCurrentUser } from "@/app/utils/supabase/get-user";
import { createClient } from "@/app/utils/supabase/server";

export async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: { id },
    include: { photos: true },
  });
  return product;
}

export async function updateProduct(_: any, formData: FormData) {
  try {
    const supabase = createClient();

    const data = {
      id: formData.get("id"),
      photos: formData.getAll("photos"),
      title: formData.get("title"),
      price: formData.get("price"),
      content: formData.get("content"),
    };

    // 기존 제품 정보 조회
    const existingProduct = await db.product.findUnique({
      where: { id: Number(data.id) },
      include: { photos: true },
    });

    if (!existingProduct) {
      return {
        success: false,
        error: {
          formErrors: ["상품을 찾을 수 없습니다."],
        },
      };
    }

    // 새로운 이미지 경로 배열
    const photoPaths: string[] = [];
    // 기존 이미지 URL들을 저장
    const existingUrls = new Set(
      existingProduct.photos.map((photo) => photo.url)
    );
    // 새로 업로드된 이미지 URL 추적
    const newlyUploadedUrls: string[] = [];

    try {
      // 폼에서 전송된 각 파일 처리
      for (const photo of data.photos) {
        if (photo instanceof File) {
          const fileExt = photo.name.split(".").pop();
          const fileName = `${Date.now()}_${Math.random()
            .toString(36)
            .substring(7)}.${fileExt}`;
          const filePath = `products/${fileName}`;

          const photoBuffer = await photo.arrayBuffer();

          const { data: uploadData, error: uploadError } =
            await supabase.storage
              .from("products")
              .upload(filePath, photoBuffer, {
                contentType: photo.type,
                upsert: false,
              });

          if (uploadError) {
            throw new Error("Failed to upload image");
          }

          const {
            data: { publicUrl },
          } = supabase.storage.from("products").getPublicUrl(filePath);

          photoPaths.push(publicUrl);
          newlyUploadedUrls.push(publicUrl);
        } else if (typeof photo === "string") {
          photoPaths.push(photo);
        }
      }

      // 삭제될 이미지 처리
      for (const existingPhoto of existingProduct.photos) {
        if (!photoPaths.includes(existingPhoto.url)) {
          const filePath = existingPhoto.url.split("/").pop();
          if (filePath) {
            const { error: deleteError } = await supabase.storage
              .from("products")
              .remove([`products/${filePath}`]);

            if (deleteError) {
              console.error("Delete error:", deleteError);
            }
          }
        }
      }

      data.photos = photoPaths;
      const result = productSchema.safeParse(data);

      if (!result.success) {
        // zod 유효성 검사 실패 시 새로 업로드된 이미지 삭제
        await cleanupNewImages(supabase, newlyUploadedUrls);
        return {
          success: false,
          error: result.error.flatten(),
        };
      }

      const session = await getCurrentUser();

      if (!session?.id) {
        await cleanupNewImages(supabase, newlyUploadedUrls);
        return {
          success: false,
          error: {
            formErrors: ["인증이 필요합니다."],
          },
        };
      }

      await db.product.update({
        where: { id: Number(data.id) },
        data: {
          title: result.data.title,
          description: result.data.content,
          price: Number(result.data.price),
          photos: {
            deleteMany: {},
            createMany: {
              data: photoPaths.map((url) => ({ url })),
            },
          },
        },
      });

      revalidateTag(`product-detail-${data.id}`);

      return {
        success: true,
      };
    } catch (error) {
      // 에러 발생 시 새로 업로드된 이미지만 삭제
      await cleanupNewImages(supabase, newlyUploadedUrls);
      throw error;
    }
  } catch (error) {
    console.error("Error in updateProduct:", error);
    return {
      success: false,
      error: {
        formErrors: ["제품 수정 중 오류가 발생했습니다."],
      },
    };
  }
}

// 새로 업로드된 이미지 정리 헬퍼 함수
async function cleanupNewImages(supabase: any, urls: string[]) {
  for (const url of urls) {
    const filePath = url.split("/").pop();
    if (filePath) {
      await supabase.storage.from("products").remove([`products/${filePath}`]);
    }
  }
}

// 제품 삭제 함수 추가
export async function deleteProduct(productId: number) {
  try {
    const supabase = createClient();

    // 제품 정보 조회
    const product = await db.product.findUnique({
      where: { id: productId },
      include: { photos: true },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // Supabase Storage에서 모든 이미지 삭제
    for (const photo of product.photos) {
      const filePath = photo.url.split("/").pop();
      if (filePath) {
        const { error: deleteError } = await supabase.storage
          .from("products")
          .remove([`products/${filePath}`]);

        if (deleteError) {
          console.error("Delete error:", deleteError);
        }
      }
    }

    // 데이터베이스에서 제품 삭제
    await db.product.delete({
      where: { id: productId },
    });

    revalidateTag("products"); // products 목록 갱신
    return { success: true };
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    return {
      success: false,
      error: "제품 삭제 중 오류가 발생했습니다.",
    };
  }
}
