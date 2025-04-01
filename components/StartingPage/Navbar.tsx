import React, { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import motion from "framer-motion";
import { useRouter } from "next/navigation";
const Navbar = ({ user, setUserSettings, userSettings }: any) => {
  const router = useRouter();
  return (
    <section className='flex justify-between bg-[#2a3441] p-4 px-5'>
      <img src='/favicon.ico' className='h-12'></img>
      <section className='flex items-center text-center text-xl text-white'>
        <div>ReMo</div>
      </section>
      <UserButton />
    </section>
  );
};

export default Navbar;
