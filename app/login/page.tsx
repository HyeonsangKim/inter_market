"use client";
import Button from "@/components/buttons/button";
import Input from "@/components/input";
import { useFormState } from "react-dom";
import { loginWithEmail } from "./actions";
import { GoogleLogin } from "@/components/buttons/client-button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LanguageSelector from "@/components/language-selector";
import Footer from "@/components/footer";
import { LoginState } from "@/app/types";
import { createClient } from "@/app/utils/supabase/client";

const initialState: LoginState = {
  success: false,
  errors: {},
  message: "",
};

export default function Login() {
  const [state, dispatch] = useFormState<LoginState, FormData>(
    loginWithEmail,
    initialState
  );
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log(session);

      if (session) {
        router.push("/");
        router.refresh();
      }
    };

    if (state?.success) {
      checkSession();
    }

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.push("/");
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [state, router, supabase]);

  return (
    <div className="flex flex-col gap-10 py-8 px-6 max-w-3xl mx-auto w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
        <h2 className="text-lg text-gray-600">Login to your account</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-4">
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
        {state?.message && (
          <p className="text-red-500 text-sm">{state.message}</p>
        )}
        <Button variant="primary">Login</Button>

        <div className="w-full h-px bg-neutral-500" />
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
          <span className="text-gray-600">Don&apos;t have an account? </span>
          <Link
            href="/create-account"
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
