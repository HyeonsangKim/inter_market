"use client";
import Button from "@/components/button";
import Input from "@/components/input";
import { useFormState } from "react-dom";
import { login } from "./actions";
import { signIn } from "next-auth/react";
import { GoogleLogin } from "@/components/client-button";

export default function Login() {
  const [state, dispatch] = useFormState(login, null);
  if (state?.isLogin) {
    signIn("credentials", state.data);
  }

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
          errors={state?.fieldErrors?.email}
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          required
          errors={state?.fieldErrors?.password}
        />
        {/* {error && <p className="text-red-500 font-medium -mt-4">{error}</p>} */}
        <div>
          <Button text="Login" />
        </div>
        <div className="w-full h-px bg-neutral-500" />
        <div>
          <GoogleLogin />
        </div>
      </form>
    </div>
  );
}
