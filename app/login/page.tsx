"use client";
import Button from "@/components/buttons/button";
import Input from "@/components/input";
import { useFormState } from "react-dom";
import { loginWithEmail } from "./actions";
import { GoogleLogin } from "@/components/buttons/client-button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../utils/supabase/client";
const initialState = {
  errors: {},
  message: null,
};
export default function Login() {
  const [state, dispatch] = useFormState(loginWithEmail, null);
  const router = useRouter();
  const supabase = createClient();
  if (state?.success) {
    router.push("/");
  }
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.push("/");
        router.refresh();
      }
    };

    checkSession();
  }, [router, supabase]);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">Hola!</h1>
        <h2 className="text-xl">Login with email and password.</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-6">
        <Input
          name="email"
          type="email"
          placeholder="Email"
          required
          errors={state?.errors?.email}
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          required
          errors={state?.errors?.password}
        />
        {/* {error && <p className="text-red-500 font-medium -mt-4">{error}</p>} */}

        <Button variant="primary">Login</Button>

        <div className="w-full h-px bg-neutral-500" />
      </form>
      <div>
        <GoogleLogin />
      </div>
    </div>
  );
}
