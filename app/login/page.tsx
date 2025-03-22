"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
const SignInPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);
  return (
    <div className='flex min-h-screen items-center justify-center '>
      <div className='w-96 rounded-lg bg-white p-8 shadow-md'>
        <h2 className='mb-4 text-center text-2xl font-semibold text-gray-800'>
          Sign In
        </h2>
        <p className='mb-6 text-center text-sm text-gray-600'>
          Access your account by signing in
        </p>

        <button
          onClick={() => signIn("google")}
          className='flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white py-2 shadow-sm transition hover:bg-gray-50'
        >
          <img src='/google.svg' alt='Google' className='h-5 w-5' />
          <span className='font-medium text-gray-700'>Sign in with Google</span>
        </button>

        <div className='my-4 text-center text-sm text-gray-400'>or</div>

        <button
          onClick={() => signIn("github")}
          className='flex w-full items-center justify-center gap-2 rounded-md bg-gray-900 py-2 text-white shadow-sm transition hover:bg-gray-800'
        >
          <img src='/github.svg' alt='GitHub' className='h-5 w-5' />
          <span className='font-medium'>Sign in with GitHub</span>
        </button>

        <p className='mt-6 text-center text-sm text-gray-500'>
          By signing in, you agree to our{" "}
          <a href='#' className='text-blue-600 hover:underline'>
            Terms & Conditions
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
