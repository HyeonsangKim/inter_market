"use server";

import { createClient } from "@/app/utils/supabase/server";

async function uploadImage(file: File) {
  const supabase = createClient();

  // 파일 이름 생성
  const fileName = `${Date.now()}_${file.name}`;
  const fileExtension = file.name.split(".").pop();
  const path = `${fileName}.${fileExtension}`;

  // 파일을 ArrayBuffer로 변환
  const arrayBuffer = await file.arrayBuffer();
  const fileData = new Uint8Array(arrayBuffer);

  // 이미지 업로드
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("profiles")
    .upload(path, fileData, {
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
  } = supabase.storage.from("profiles").getPublicUrl(path);

  return publicUrl;
}

async function deleteImage(url: string) {
  const supabase = createClient();
  const path = url.split("/").pop();

  if (path) {
    const { error } = await supabase.storage.from("profiles").remove([path]);

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

    const updateData: { full_name?: string; avatar_url?: string } = {};

    // 이름 업데이트
    if (name) {
      updateData.full_name = name;
    }

    // 이미지 처리
    if (imageFile && imageFile.size > 0) {
      // 기존 이미지 URL 가져오기
      const { data: userData } = await supabase
        .from("user")
        .select("avatar_url")
        .eq("id", session.user.id)
        .single();

      // 기존 이미지 삭제
      if (userData?.avatar_url) {
        await deleteImage(userData.avatar_url);
      }

      // 새 이미지 업로드
      const newImageUrl = await uploadImage(imageFile);
      updateData.avatar_url = newImageUrl;
    }

    // 프로필 업데이트
    const { error: updateError } = await supabase
      .from("profiles")
      .update(updateData)
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
