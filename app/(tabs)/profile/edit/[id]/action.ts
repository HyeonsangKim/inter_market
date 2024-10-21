"use server";

import { createClient } from "@supabase/supabase-js";
import { db } from "@/lib/db";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function deleteImage(url: string) {
  // URL에서 파일 경로 추출
  const path = url.split("/").pop();
  if (path) {
    const { error } = await supabase.storage.from("profiles").remove([path]);
    if (error) {
      console.error("Error deleting file:", error);
    }
  }
}

async function uploadImage(file: File) {
  const fileName = `${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage
    .from("profiles")
    .upload(fileName, file);

  if (error) {
    console.error("Error uploading file:", error);
    return null;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("profiles").getPublicUrl(fileName);

  return publicUrl;
}

export async function editProfile(_: any, formData: FormData) {
  const data = {
    image: formData.get("image") as File | null,
    name: formData.get("name") as string,
    email: formData.get("email") as string,
  };

  // 현재 사용자 정보 가져오기
  const currentUser = await db.user.findUnique({
    where: { email: data.email },
    select: { image: true },
  });

  const updateData: { name?: string; image?: string } = {
    name: data.name,
  };

  if (data.image && data.image.size > 0) {
    // 기존 이미지 삭제
    if (currentUser?.image) {
      await deleteImage(currentUser.image);
    }
    // 새 이미지 업로드
    const imageUrl = await uploadImage(data.image);
    if (imageUrl) {
      updateData.image = imageUrl;
    }
  }

  const result = await db.user.update({
    where: { email: data.email },
    data: updateData,
  });

  return result;
}

interface Data {
  image: File | null;
  name: string;
  email: string;
}

export async function editProfile2({ image, name, email }: Data) {
  // 현재 사용자 정보 가져오기
  const currentUser = await db.user.findUnique({
    where: { email },
    select: { image: true },
  });

  const updateData: { name: string; image?: string } = { name };

  if (image && image.size > 0) {
    // 기존 이미지 삭제
    if (currentUser?.image) {
      await deleteImage(currentUser.image);
    }
    // 새 이미지 업로드
    const imageUrl = await uploadImage(image);
    if (imageUrl) {
      updateData.image = imageUrl;
    }
  }

  const result = await db.user.update({
    where: { email },
    data: updateData,
  });

  return result;
}
