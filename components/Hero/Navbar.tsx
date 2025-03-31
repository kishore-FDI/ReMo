import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import motion from "framer-motion";
const Navbar = ({ setIsProfile, isProfile }: any) => {
  const { data: session, status } = useSession();
  return (
    <section className='flex justify-between bg-[#2a3441] p-4 px-5'>
      <img src='/favicon.ico' className='h-12'></img>
      <section className='flex items-center text-center text-xl text-white'>
        <div>ReMo</div>
      </section>
      <div>
        {session && (
          <button onClick={() => setIsProfile(!isProfile)}>
            <Image
              src={session?.user.image}
              width={40}
              height={40}
              className=' rounded-full'
              alt={""}
            />
          </button>
        )}
      </div>
    </section>
  );
};

export default Navbar;
