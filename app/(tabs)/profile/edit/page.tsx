"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Button from "@/components/button";
import Input from "@/components/Input";
import { useUser } from "@/components/userContext";
import { ChangeEvent, useState } from "react";
import { useFormState } from "react-dom";
import { editProfile } from "./action";

export default function ProfileEdit() {
  const userData = useUser();
  const [preview, setPreview] = useState(userData.image);
  const [name, setName] = useState(userData.name);
  const [image, setImage] = useState<string | null>(userData.image);
  const { update } = useSession();

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
    const url = URL.createObjectURL(file);

    setPreview(url);
    setImage(file.name); // 업로드된 이미지를 상태에 저장
  };

  const onNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const [state, action] = useFormState(editProfile, null);

  return (
    <div className="p-5">
      <form action={action}>
        <div className="card">
          <div className="p-6">
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="relative h-32 w-32">
                  <label htmlFor="image">
                    <Image
                      width={128}
                      height={128}
                      className="size-20 md:size-28 rounded-full"
                      src={preview || image || ""}
                      alt={userData.name!}
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
                  value={userData.name || undefined}
                  onChange={onNameChange}
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
                  value={userData.email || undefined}
                  readOnly
                />
              </div>

              <div
                className="flex justify-end"
                onClick={() => {
                  update({
                    id: userData.id,
                    image,
                    name,
                    email: userData.email,
                  });
                }}
              >
                <Button type="submit">Save Changes</Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
