"use client";

import Input from "@/components/Input";
import { useFormState } from "react-dom";
import { createAccount } from "./actions";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import { GoogleLogin } from "@/components/buttons/ClientButton";
import Link from "next/link";
import { CreateAccountState } from "../types";
import Button from "@/components/buttons/Button";
const initialState: CreateAccountState = {
  fieldErrors: {},
  formError: undefined,
};
export default function CreatAccount() {
  const [state, dispatch] = useFormState<CreateAccountState, FormData>(
    createAccount,
    initialState
  );
  return (
    <div className="flex flex-col gap-10 py-8 px-6 max-w-3xl mx-auto w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">Hello!</h1>
        <h2 className="text-lg text-gray-600">
          Fill in the form below to join!
        </h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        <Input
          name="name"
          type="text"
          placeholder="name"
          required
          errors={state?.fieldErrors?.name}
          minLength={3}
          maxLength={10}
        />
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
          min={PASSWORD_MIN_LENGTH}
        />
        <Input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          required
          errors={state?.fieldErrors?.confirmPassword}
          min={PASSWORD_MIN_LENGTH}
        />
        <Button variant="primary">Create Account</Button>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>
      <div className="space-y-3">
        <div onClick={(e) => e.preventDefault()}>
          <GoogleLogin />
        </div>
        <div className="text-center">
          <span className="text-gray-600">Already have an account? </span>
          <Link
            href="/login"
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
