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
  const [state, action] = useFormState(editProfile, null);

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
      console.log(session.user.id);

      const { data: userProfile, error } = await supabase
        .from("user")
        .select("*") // 전체 필드 선택
        .eq("id", session.user.id) // match 대신 eq 사용
        .single();
      console.log(userProfile);

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

  const handleSubmit = async (formData: FormData) => {
    const result = await action(formData);
    if (result?.success) {
      router.refresh();
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-5">
      <form action={handleSubmit}>
        <div className="card">
          <div className="p-6">
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="relative h-32 w-32">
                  <label htmlFor="image">
                    <Image
                      width={128}
                      height={128}
                      className="size-20 md:size-28 rounded-full object-cover"
                      src={
                        preview || userData.avatar_url || "/default-avatar.png"
                      }
                      alt={userData.full_name}
                    />
                  </label>
                  <input
                    onChange={onImageChange}
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="label">
                  Full Name
                </label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  defaultValue={userData.full_name}
                />
              </div>
              <div>
                <label htmlFor="email" className="label">
                  Email
                </label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  value={userData.email}
                  readOnly
                />
              </div>

              {state?.error && <p className="text-red-500">{state.error}</p>}

              <div className="flex justify-end">
                <Button type="submit">Save Changes</Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
