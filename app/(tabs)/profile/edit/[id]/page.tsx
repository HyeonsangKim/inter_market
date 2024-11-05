"use client";

import { useEffect, useState, ChangeEvent } from "react";
import Image from "next/image";
import Button from "@/components/buttons/button";
import Input from "@/components/input";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/utils/supabase/client";
import { editProfile } from "./action";

export default function ProfileEdit({ params }: { params: { id: string } }) {
  const router = useRouter();
  const supabase = createClient();
  const [userData, setUserData] = useState<any>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [state, dispatch] = useFormState(editProfile, null);

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }

      if (params.id !== session.user.id) {
        router.push("/404");
        return;
      }

      const { data: userProfile, error } = await supabase
        .from("user")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      if (userProfile) {
        setUserData(userProfile);
        setPreview(userProfile.image);
      }
    }

    loadProfile();
  }, [params.id, router, supabase]);

  useEffect(() => {
    if (state?.success) {
      router.refresh();
    }
  }, [state, router]);

  const onImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일을 선택해주세요.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB를 초과할 수 없습니다.");
      return;
    }

    setPreview(URL.createObjectURL(file));
  };

  if (!userData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto p-4">
      <form action={dispatch} className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-32 h-32 mb-4">
              <label
                htmlFor="image"
                className="cursor-pointer block w-full h-full"
              >
                <div className="relative w-full h-full">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <Image
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                      src={preview || userData?.image || "/default-avatar.png"}
                      alt={userData?.name || "Profile"}
                      priority
                    />
                  </div>
                  <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                    <span className="text-white text-sm font-medium">
                      Change Photo
                    </span>
                  </div>
                </div>
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={onImageChange}
                className="hidden"
              />
            </div>

            <div className="w-full space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  defaultValue={userData.name}
                  className="w-full"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  value={userData.email}
                  readOnly
                  className="w-full bg-gray-50"
                />
              </div>
            </div>
          </div>

          {state?.error && (
            <div className="text-red-500 text-sm text-center mb-4">
              {state.error}
            </div>
          )}

          <div className="flex justify-end">
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
