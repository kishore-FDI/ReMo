import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { motion } from "framer-motion";
import {
  FaChalkboard,
  FaVideo,
  FaTasks,
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaClock,
  FaChartLine,
  FaUsers,
  FaProjectDiagram,
  FaDumpster,
  FaDumpsterFire,
} from "react-icons/fa";
import { SignedOut, SignOutButton } from "@clerk/nextjs";

const Layout = ({ user }: any) => {
  const [isProfile, setIsProfile] = useState(false);
  useEffect(() => {
    console.log(user);
  }, []);
  const navItems = [
    {
      title: "Whiteboard",
      href: "/whiteboard",
      icon: <FaChalkboard className='h-6 w-6' />,
      description: "Collaborative drawing and brainstorming",
    },
    {
      title: "Virtual Meeting",
      href: "/virtualmeeting",
      icon: <FaVideo className='h-6 w-6' />,
      description: "Real-time video conferencing",
    },
    {
      title: "Project Management",
      href: "/projectmanagement",
      icon: <FaTasks className='h-6 w-6' />,
      description: "Track and manage your projects",
    },
  ];

  const stats = [
    {
      title: "Active Projects",
      value: "12",
      icon: <FaProjectDiagram className='h-6 w-6' />,
    },
    {
      title: "Team Members",
      value: "24",
      icon: <FaUsers className='h-6 w-6' />,
    },
    {
      title: "Hours Logged",
      value: "156",
      icon: <FaClock className='h-6 w-6' />,
    },
    {
      title: "Productivity",
      value: "92%",
      icon: <FaChartLine className='h-6 w-6' />,
    },
  ];

  return (
    <main className='flex min-h-screen flex-col bg-[#202731]'>
      <Navbar isProfile={isProfile} setIsProfile={setIsProfile} user={user} />

      {/* Hero Section */}

      <section className='flex flex-1'>
        {/* Sidebar */}
        <section className='w-[20rem] bg-[#2a3441] p-6 shadow-lg'>
          <div className='space-y-4'>
            {navItems.map((item, index) => (
              <motion.a
                key={item.href}
                href={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className='group flex items-center space-x-4 rounded-lg p-4 text-gray-300 transition-all hover:bg-[#3a4451] hover:text-white'
              >
                <div className='rounded-lg bg-[#202731] p-3 text-blue-400 group-hover:bg-[#2a3441]'>
                  {item.icon}
                </div>
                <div>
                  <h3 className='font-semibold'>{item.title}</h3>
                  <p className='text-sm text-gray-400'>{item.description}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </section>

        {/* Main Section */}
        <section className='flex-1 p-8'>
          {isProfile && (
            <div className='space-y-6'>
              {/* User Profile Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className='rounded-xl border border-gray-700 bg-[#2a3441] p-6 shadow-lg'
              >
                <div className='flex items-center space-x-6'>
                  <img
                    src={user?.imageUrl || "/default-avatar.png"}
                    alt='User Avatar'
                    className='h-24 w-24 rounded-full border-2 border-blue-500'
                  />
                  <div>
                    <h2 className='text-2xl font-bold text-white'>
                      {user?.firstName}
                    </h2>
                    <h2 className='text-2xl font-bold text-white'>
                      {user?.lastName}
                    </h2>
                    <p className='text-gray-300'>
                      {user?.primaryEmailAddress?.emailAddress}
                    </p>
                    <div className='mt-2 flex items-center space-x-4 text-sm text-gray-400'>
                      <span className='flex items-center'>
                        <FaCalendarAlt className='mr-2' />
                        Last logged in{" "}
                        {user?.lastSignInAt
                          ? new Date(user.lastSignInAt).toLocaleString()
                          : ""}
                      </span>
                    </div>
                    <SignOutButton>
                      <span className='flex  cursor-pointer text-red-500'>
                        <FaDumpsterFire className='mr-2 mt-0.5 size-6' />
                        SignOut
                      </span>
                    </SignOutButton>
                  </div>
                </div>
              </motion.div>

              {/* Stats Grid */}
              <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className='rounded-xl border border-gray-700 bg-[#2a3441] p-6 shadow-lg'
                  >
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-sm text-gray-400'>{stat.title}</p>
                        <p className='mt-2 text-2xl font-bold text-white'>
                          {stat.value}
                        </p>
                      </div>
                      <div className='rounded-lg bg-[#202731] p-3 text-blue-400'>
                        {stat.icon}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className='rounded-xl border border-gray-700 bg-[#2a3441] p-6 shadow-lg'
              >
                <h3 className='mb-4 text-xl font-bold text-white'>
                  Recent Activity
                </h3>
                <div className='space-y-4'>
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className='flex items-center space-x-4 rounded-lg bg-[#202731] p-4'
                    >
                      <div className='rounded-lg bg-blue-500/10 p-2 text-blue-400'>
                        <FaChalkboard className='h-5 w-5' />
                      </div>
                      <div className='flex-1'>
                        <p className='text-sm text-white'>
                          Updated Whiteboard Project
                        </p>
                        <p className='text-xs text-gray-400'>2 hours ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </section>
      </section>
    </main>
  );
};

export default Layout;
