"use client";
import React from "react";
import Navbar from "./Navbar";
import { FiPlus, FiUsers } from "react-icons/fi";
import { motion } from "framer-motion";

const companies = [
  { id: 1, name: "TechCorp" },
  { id: 2, name: "InnovateX" },
  { id: 3, name: "NextGen Solutions" },
];

const Companies = ({ user }: any) => {
  return (
    <>
      <Navbar user={user} />
      <div className='flex min-h-screen bg-[#202731] text-white'>
        {/* Sidebar */}
        <aside className='w-72 bg-[#2a3441] p-6 shadow-lg'>
          <h2 className='mb-6 text-xl font-semibold text-teal-400'>
            Your Companies
          </h2>
          <ul className='space-y-4'>
            {companies.map((company) => (
              <motion.li
                key={company.id}
                className='flex items-center gap-3 rounded-md bg-gray-800 p-3 transition hover:bg-teal-500/20'
                whileHover={{ scale: 1.05 }}
              >
                <FiUsers className='text-teal-400' />
                <span>{company.name}</span>
              </motion.li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className='flex flex-1 flex-col items-center justify-center px-8'>
          <h1 className='mb-6 text-4xl font-bold'>
            Welcome, <span className='text-teal-400'>{user?.firstName}</span>
          </h1>
          <p className='mb-8 text-gray-400'>
            Create a new company or join an existing one.
          </p>

          <div className='flex space-x-6'>
            {/* Create Company Button */}
            <motion.button
              className='flex items-center gap-3 rounded-lg bg-teal-400 px-6 py-3 text-lg font-medium text-[#202731] transition hover:bg-teal-500'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiPlus className='text-2xl' />
              Create Company
            </motion.button>

            {/* Join Company Button */}
            <motion.button
              className='flex items-center gap-3 rounded-lg border border-teal-400 px-6 py-3 text-lg font-medium text-teal-400 transition hover:bg-teal-400 hover:text-[#202731]'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Join Company
            </motion.button>
          </div>
        </main>
      </div>
    </>
  );
};

export default Companies;
