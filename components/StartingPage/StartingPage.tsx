"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./Navbar";
import {
  FiPlus,
  FiUsers,
  FiX,
  FiLoader,
  FiLink,
  FiCheck,
  FiCopy,
  FiArrowRight,
  FiGlobe,
} from "react-icons/fi";
import { useApp } from "../../context/CompanyContext";
import { motion } from "framer-motion";

interface Company {
  id: string;
  name: string;
  role: string;
  createdAt: string;
}

const StartingPage = ({ user }: any) => {
  const [userSettings, setUserSettings] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [newCompany, setNewCompany] = useState<{
    id: string;
    name: string;
    inviteCode: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const { setSelectedCompany } = useApp();
  const router = useRouter();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/company");
      if (!res.ok) {
        throw new Error("Failed to fetch companies");
      }

      const data = await res.json();
      setCompanies(data.companies);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const createCompany = async () => {
    if (!companyName || companyName.trim() === "") {
      setError("Company name is required");
      return;
    }

    try {
      const res = await fetch("/api/company/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: companyName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      setNewCompany(data.company);
      setCompanyName("");
      setError("");
      setShowCreateModal(false);
      setShowSuccessModal(true);
      fetchCompanies();
    } catch (error) {
      console.error(error);
      setError("Failed to create company");
    }
  };

  const joinCompany = async () => {
    if (!inviteCode || inviteCode.trim() === "") {
      setError("Invite code is required");
      return;
    }

    try {
      const res = await fetch("/api/company/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      setInviteCode("");
      setError("");
      setShowJoinModal(false);
      fetchCompanies();
    } catch (error) {
      console.error(error);
      setError("Failed to join company");
    }
  };

  const copyInviteLink = () => {
    if (!newCompany) return;
    const shareableLink = `${window.location.origin}/join?code=${newCompany.inviteCode}`;
    navigator.clipboard.writeText(shareableLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyInviteCode = () => {
    if (!newCompany) return;
    navigator.clipboard.writeText(newCompany.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
    router.push("/home");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className='min-h-screen bg-[#1c212b]'>
      <Navbar
        user={user}
        setUserSettings={setUserSettings}
        userSettings={userSettings}
      />

      <div className='container mx-auto max-w-7xl px-4 py-12'>
        {/* Welcome Header */}
        <motion.div
          className='mb-16 text-center'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className='mb-2 text-5xl font-bold text-white'>
            Welcome back,{" "}
            <span className='text-[#16e0bd]'>
              {user?.firstName} {user?.lastName}
            </span>
          </h1>
          <p className='text-lg text-gray-400'>
            Select a company to continue or create a new one
          </p>
        </motion.div>

        <div className='flex flex-col gap-8 lg:flex-row'>
          {/* Company Cards Section */}
          <motion.div
            className='flex-1'
            variants={containerVariants}
            initial='hidden'
            animate='visible'
          >
            <div className='mb-6 flex items-center'>
              <FiGlobe className='mr-3 text-2xl text-[#16e0bd]' />
              <h2 className='text-2xl font-semibold text-white'>
                Your Companies
              </h2>
            </div>

            {loading ? (
              <div className='flex justify-center py-16'>
                <FiLoader className='animate-spin text-3xl text-[#16e0bd]' />
              </div>
            ) : companies.length === 0 ? (
              <div className='rounded-xl bg-[#252a36] p-12 text-center'>
                <p className='text-lg text-gray-300'>
                  You don&apos;t have any companies yet
                </p>
                <p className='mt-2 text-gray-400'>
                  Create your first company to get started
                </p>
              </div>
            ) : (
              <div className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3'>
                {companies.map((company) => (
                  <motion.div
                    key={company.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                    className='overflow-hidden rounded-xl bg-[#252a36]'
                  >
                    <div className='p-6'>
                      <div className='mb-8 flex items-start'>
                        <div className='mr-4 rounded-xl bg-[#2d3444] p-4'>
                          <FiUsers className='text-xl text-[#16e0bd]' />
                        </div>
                        <div>
                          <h3 className='text-xl font-bold text-white'>
                            {company.name}
                          </h3>
                          <span className='text-sm capitalize text-gray-400'>
                            {company.role}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleCompanySelect(company)}
                        className='flex w-full items-center justify-center gap-2 rounded-lg bg-[#2d3444] py-3 font-medium text-[#16e0bd] transition-colors hover:bg-[#36404f]'
                      >
                        Select Company <FiArrowRight />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Action Panel */}
          <motion.div
            className='lg:w-80'
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className='sticky top-24 rounded-xl bg-[#252a36] p-6'>
              <h3 className='mb-6 text-xl font-semibold text-white'>Actions</h3>

              <div className='space-y-4'>
                <motion.button
                  className='flex w-full items-center justify-center gap-2 rounded-lg bg-[#16e0bd] py-3 font-medium text-[#1c212b] transition-colors hover:bg-[#13c6a7]'
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCreateModal(true)}
                >
                  <FiPlus className='text-xl' />
                  Create Company
                </motion.button>

                <motion.button
                  className='flex w-full items-center justify-center gap-2 rounded-lg border border-[#16e0bd] bg-transparent py-3 font-medium text-[#16e0bd] transition-colors hover:bg-[#16e0bd]/10'
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowJoinModal(true)}
                >
                  <FiLink className='text-xl' />
                  Join Company
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Create Company Modal */}
      {showCreateModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm'>
          <motion.div
            className='w-full max-w-md rounded-xl bg-[#252a36] p-6 shadow-2xl'
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className='mb-6 flex items-center justify-between'>
              <h3 className='text-2xl font-semibold text-white'>
                Create New Company
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className='p-1 text-gray-400 transition-colors hover:text-white'
              >
                <FiX size={24} />
              </button>
            </div>

            <div className='mb-6'>
              <label
                htmlFor='companyName'
                className='mb-2 block text-sm font-medium text-gray-300'
              >
                Company Name
              </label>
              <input
                type='text'
                id='companyName'
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className='w-full rounded-lg border border-[#36404f] bg-[#1c212b] p-4 text-white transition-all focus:border-[#16e0bd] focus:outline-none'
                placeholder='Enter company name'
              />
              {error && <p className='mt-2 text-sm text-red-400'>{error}</p>}
            </div>

            <div className='flex justify-end space-x-4'>
              <button
                onClick={() => setShowCreateModal(false)}
                className='rounded-lg px-5 py-3 text-gray-300 transition-colors hover:text-white'
              >
                Cancel
              </button>
              <motion.button
                onClick={createCompany}
                className='rounded-lg bg-[#16e0bd] px-5 py-3 font-medium text-[#1c212b] transition-colors hover:bg-[#13c6a7]'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Create
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Join Company Modal */}
      {showJoinModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm'>
          <motion.div
            className='w-full max-w-md rounded-xl bg-[#252a36] p-6 shadow-2xl'
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className='mb-6 flex items-center justify-between'>
              <h3 className='text-2xl font-semibold text-white'>
                Join Company
              </h3>
              <button
                onClick={() => setShowJoinModal(false)}
                className='p-1 text-gray-400 transition-colors hover:text-white'
              >
                <FiX size={24} />
              </button>
            </div>

            <div className='mb-6'>
              <label
                htmlFor='inviteCode'
                className='mb-2 block text-sm font-medium text-gray-300'
              >
                Invite Code
              </label>
              <input
                type='text'
                id='inviteCode'
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className='w-full rounded-lg border border-[#36404f] bg-[#1c212b] p-4 text-white transition-all focus:border-[#16e0bd] focus:outline-none'
                placeholder='Enter company invite code'
              />
              {error && <p className='mt-2 text-sm text-red-400'>{error}</p>}
            </div>

            <div className='flex justify-end space-x-4'>
              <button
                onClick={() => setShowJoinModal(false)}
                className='rounded-lg px-5 py-3 text-gray-300 transition-colors hover:text-white'
              >
                Cancel
              </button>
              <motion.button
                onClick={joinCompany}
                className='rounded-lg bg-[#16e0bd] px-5 py-3 font-medium text-[#1c212b] transition-colors hover:bg-[#13c6a7]'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Join
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Success Modal After Company Creation */}
      {showSuccessModal && newCompany && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm'>
          <motion.div
            className='w-full max-w-md rounded-xl bg-[#252a36] p-6 shadow-2xl'
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className='mb-6 flex items-center justify-between'>
              <div className='flex items-center'>
                <div className='mr-3 rounded-full bg-green-500/20 p-2'>
                  <FiCheck className='text-green-500' size={20} />
                </div>
                <h3 className='text-2xl font-semibold text-white'>
                  Company Created
                </h3>
              </div>
              <button
                onClick={() => setShowSuccessModal(false)}
                className='p-1 text-gray-400 transition-colors hover:text-white'
              >
                <FiX size={24} />
              </button>
            </div>

            <div className='mb-6'>
              <h4 className='mb-4 text-xl font-medium text-[#16e0bd]'>
                {newCompany.name}
              </h4>
              <p className='mb-4 text-gray-300'>
                Share this invite code with others to join your company:
              </p>

              <div className='mb-6 flex items-center justify-between rounded-lg bg-[#1c212b] p-4'>
                <code className='font-mono text-lg text-[#16e0bd]'>
                  {newCompany.inviteCode}
                </code>
                <motion.button
                  onClick={copyInviteCode}
                  className='p-2 text-gray-400 hover:text-[#16e0bd]'
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {copied ? (
                    <FiCheck className='text-green-400' size={20} />
                  ) : (
                    <FiCopy size={20} />
                  )}
                </motion.button>
              </div>

              <motion.button
                onClick={copyInviteLink}
                className='flex w-full items-center justify-center gap-2 rounded-lg bg-[#36404f] px-4 py-3 font-medium text-[#16e0bd] transition-colors hover:bg-[#424e61]'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiLink />
                {copied ? "Copied!" : "Copy Invite Link"}
              </motion.button>
            </div>

            <div className='flex justify-end'>
              <motion.button
                onClick={() => setShowSuccessModal(false)}
                className='rounded-lg bg-[#16e0bd] px-5 py-3 font-medium text-[#1c212b] transition-colors hover:bg-[#13c6a7]'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Done
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default StartingPage;
