import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Navbar from "./Navbar";

const Layout = () => {
  const [isProfile, setIsProfile] = useState(false);
  const { data: session } = useSession();

  return (
    <main className='flex min-h-screen flex-col'>
      <Navbar isProfile={isProfile} setIsProfile={setIsProfile} />
      <section className='flex'>
        {/* Sidebar */}
        <section className='flex w-[20rem] flex-col gap-4 p-4'>
          <a
            href='/whiteboard'
            // className='text-lg font-semibold hover:underline'
          >
            Whiteboard
          </a>
          <a
            href='/virtualmeeting'
            // className='text-lg font-semibold hover:underline'
          >
            Virtual Meeting
          </a>
          <a
            href='/projectmangement'
            // className='text-lg font-semibold hover:underline'
          >
            Project Management
          </a>
        </section>

        {/* Main Section */}
        <section className='flex-1 p-6'>
          {isProfile && session && (
            <div className='max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow-lg'>
              <div className='flex items-center space-x-4'>
                <img
                  src={session.user?.image || "/default-avatar.png"}
                  alt='User Avatar'
                  className='h-16 w-16 rounded-full border border-gray-300'
                />
                <div>
                  <h2 className='text-xl font-bold'>{session.user?.name}</h2>
                  <p className='text-gray-600'>{session.user?.email}</p>
                </div>
              </div>
            </div>
          )}
        </section>
      </section>
    </main>
  );
};

export default Layout;
