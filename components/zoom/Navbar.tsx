import { SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

import MobileNav from "./MobileNav";

const Navbar = () => {
  return (
    <nav className='flex-between bg-dark-1 fixed z-50 w-full px-6 py-4 lg:px-10'>
      <Link href='/' className='flex items-center gap-1'>
        <Image
          src='/icons/logo.svg'
          width={32}
          height={32}
          alt='ReMo logo'
          className='max-sm:size-10'
        />
        <p className='text-[26px] font-extrabold text-white max-sm:hidden'>
          ReMo
        </p>
      </Link>
      <div className='flex-between gap-5'>
        <SignedIn>
          <UserButton afterSignOutUrl='/sign-in' />
        </SignedIn>

        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
