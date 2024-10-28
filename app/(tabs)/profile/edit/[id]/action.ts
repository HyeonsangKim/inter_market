"use server";

import { createClient } from "@/app/utils/supabase/server";

async function uploadImage(file: File) {
  const supabase = createClient();

  // 파일 이름 생성 - 확장자를 포함한 단일 파일명으로 변경
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `public/${fileName}`;

  // 파일을 ArrayBuffer로 변환
  const arrayBuffer = await file.arrayBuffer();
  const fileData = new Uint8Array(arrayBuffer);

  // 이미지 업로드
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("profiles")
    .upload(filePath, fileData, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    console.error("Error uploading file:", uploadError);
    throw uploadError;
  }

  // 공개 URL 생성
  const {
    data: { publicUrl },
  } = supabase.storage.from("profiles").getPublicUrl(filePath);

  return publicUrl;
}

async function deleteImage(url: string) {
  if (!url) return;

  const supabase = createClient();
  // URL에서 public/ 이후의 파일명만 추출
  const path = url.split("public/").pop();

  if (path) {
    const { error } = await supabase.storage
      .from("profiles")
      .remove([`public/${path}`]);

    if (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  }
}

export async function editProfile(prevState: any, formData: FormData) {
  try {
    const supabase = createClient();

    const name = formData.get("name") as string;
    const imageFile = formData.get("image") as File;

    // 현재 사용자 세션 가져오기
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("Not authenticated");
    }

    const updateData: { name?: string; image?: string } = {};

    // 이름 업데이트
    if (name) {
      updateData.name = name; // full_name -> name으로 변경
    }

    // 이미지 처리
    if (imageFile && imageFile.size > 0) {
      // 기존 이미지 URL 가져오기
      const { data: userData } = await supabase
        .from("user") // profiles -> user로 변경
        .select("image") // avatar_url -> image로 변경
        .eq("id", session.user.id)
        .single();

      // 기존 이미지 삭제
      if (userData?.image) {
        await deleteImage(userData.image);
      }

      // 새 이미지 업로드
      const newImageUrl = await uploadImage(imageFile);
      updateData.image = newImageUrl; // avatar_url -> image로 변경
    }

    // 프로필 업데이트
    const { error: updateError } = await supabase
      .from("user") // profiles -> user로 변경
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", session.user.id);

    if (updateError) {
      throw updateError;
    }

    return { success: true };
  } catch (error) {
    console.error("Profile update error:", error);
    return { success: false, error: "Profile update failed" };
  }
}
