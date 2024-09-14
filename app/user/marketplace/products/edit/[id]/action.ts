"use server";

import fs from "fs/promises";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/getCurrentUser";
import { productSchema } from "../../create/shema";

export async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: { id },
    include: { photos: true },
  });
  return product;
}

export async function updateProduct(_: any, formData: FormData) {
  const data = {
    id: formData.get("id"),
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
      await fs.writeFile(`./public${photoPath}`, Buffer.from(photoData));
      photoPaths.push(photoPath);
    } else if (typeof photo === "string") {
      // 기존 이미지 경로 유지
      photoPaths.push(photo);
    }
  }

  data.photos = photoPaths;
  const result = productSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getCurrentUserId();

    if (session?.id) {
      await db.product.update({
        where: { id: Number(data.id) },
        data: {
          title: result.data.title,
          description: result.data.content,
          price: result.data.price,
          photos: {
            deleteMany: {},
            createMany: {
              data: photoPaths.map((path) => ({ url: path })),
            },
          },
        },
      });
      redirect(`/user/marketplace/products`);
    }
  }
}
