"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useUser } from "@/components/userContext";
import { ChangeEvent, useState } from "react";
import { useFormState } from "react-dom";
import { editProfile } from "./action";

export default function Page() {
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
      <form action={action} className="flex gap-10">
        <label htmlFor="image">
          <Image
            width={64}
            height={64}
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
        <div className="flex flex-col gap-4 w-36">
          <Input
            name="email"
            value={userData.email || undefined}
            type="text"
            required
            readOnly
          />
          <div>이름</div>
          <div>
            <Input
              name="name"
              value={name || undefined}
              type="text"
              required
              onChange={onNameChange}
            />
          </div>
          <div
            onClick={() => {
              update({ image, name, email: userData.email });
              // using update() called from the useSession hook
              // handleSubmit();
            }}
          >
            <Button text="edit" />
          </div>
        </div>
      </form>
    </div>
  );
}
