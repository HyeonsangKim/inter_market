"use server";

import fs from "fs/promises";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export async function editProfile(_: any, formData: FormData) {
  const data = {
    image: formData.get("image") as any,
    name: formData.get("name") as string,
    email: formData.get("email") as string,
  };

  if (data.image.name === "undefined") {
    const updateData: { name?: string } = {
      name: data?.name,
    };

    const result = await db.user.update({
      where: {
        email: data?.email,
      },
      data: updateData,
    });
    return result;
  } else {
    if (data.image instanceof File) {
      const photoData = await data.image.arrayBuffer();
      await fs.appendFile(
        `./public/img/${data.image.name}`,
        Buffer.from(photoData)
      );
      data.image = `/img/${data.image.name}`;
    }
    const updateData: { name?: string; image?: string } = {
      name: data?.name,
    };

    if (data?.image) {
      updateData.image = data.image;
    }
    const result = await db.user.update({
      where: {
        email: data?.email,
      },
      data: updateData,
    });
    return result;
  }

  //   const result = productSchema.safeParse(data);
}
interface data {
  image: File;
  name: string;
  email: string;
}
export async function editProfile2({ image, name, email }: data) {
  let imgName;

  if (image instanceof File) {
    const photoData = await image.arrayBuffer();
    await fs.appendFile(`./public/img/${image.name}`, Buffer.from(photoData));
    imgName = `/img/${image.name}`;
  }
  const updateData: { name?: string; image?: string } = {
    name: name,
  };

  if (image) {
    updateData.image = imgName;
  }
  const result = await db.user.update({
    where: {
      email: email,
    },
    data: updateData,
  });
  return result;
  //   const result = productSchema.safeParse(data);
}
