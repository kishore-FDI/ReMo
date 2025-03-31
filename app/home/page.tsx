"use client";
import Home from "@/components/WhiteBoard";
import React, { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Layout from "@/components/Hero/Layout";

const App = () => {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/login"); // Redirect to Clerk's sign-in page
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return <p>Loading...</p>;
  }
  if (isSignedIn) {
    return (
      <>
        <Layout />
      </>
    );
  }
};

export default App;
