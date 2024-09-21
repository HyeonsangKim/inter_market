"use server";

import fs from "fs/promises";
import { redirect } from "next/navigation";
import { productSchema } from "./shema";
import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/getCurrentUser";

export async function uploadProduct(_: any, formData: FormData) {
  const data = {
    photos: formData.getAll("photos"),
    title: formData.get("title"),
    price: formData.get("price"),
    content: formData.get("content"),
  };

  const photoPaths: string[] = [];
  for (const photo of data.photos) {
    if (photo instanceof File) {
      const photoData = await photo.arrayBuffer();

      const photoPath = `/productsImg/${Date.now()}_${photo.name}`;
      await fs.writeFile(
        `./public${photoPath}`,
        new Uint8Array(Buffer.from(photoData))
      );
      photoPaths.push(photoPath); // 저장된 경로를 배열에 추가합니다.
    }
  }

  data.photos = photoPaths; // 파일 경로들을 배열로 저장합니다.
  const result = productSchema.safeParse(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getCurrentUserId();

    if (session!.id) {
      const product = await db.product.create({
        data: {
          title: result.data.title,
          description: result.data.content,
          price: Number(result.data.price),
          photos: {
            createMany: {
              data: photoPaths.map((path) => ({ url: path })),
            },
          },
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
      console.log(product);

      redirect(`/user/marketplace/products/`);
    }
  }
}
