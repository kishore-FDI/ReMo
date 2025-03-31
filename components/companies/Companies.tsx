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
} from "react-icons/fi";
import { useCompany } from "../../context/CompanyContext";
import { motion } from "framer-motion";

interface Company {
  id: string;
  name: string;
  role: string;
  createdAt: string;
}

const Companies = ({ user }: any) => {
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

  // Get the company context
  const { setSelectedCompany } = useCompany();
  const router = useRouter();
  // Fetch companies when component mounts
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

      // Store new company data for success modal
      setNewCompany(data.company);

      // Reset form and close modal
      setCompanyName("");
      setError("");
      setShowCreateModal(false);
      setShowSuccessModal(true);

      // Refresh the companies list
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

      // Reset form and close modal
      setInviteCode("");
      setError("");
      setShowJoinModal(false);

      // Refresh the companies list
      fetchCompanies();
    } catch (error) {
      console.error(error);
      setError("Failed to join company");
    }
  };

  const copyInviteLink = () => {
    if (!newCompany) return;

    // Create a shareable link - this should be your app's URL
    const shareableLink = `${window.location.origin}/join?code=${newCompany.inviteCode}`;
    navigator.clipboard.writeText(shareableLink);
    setCopied(true);

    // Reset copied state after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  };

  const copyInviteCode = () => {
    if (!newCompany) return;
    navigator.clipboard.writeText(newCompany.inviteCode);
    setCopied(true);

    // Reset copied state after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle company selection
  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
    // You can add additional logic here, like navigation or UI updates
    router.push("/home");
    console.log(`Selected company: ${company.name}`);
  };

  return (
    <>
      <Navbar user={user} />
      <div className='flex min-h-screen bg-[#202731] text-white'>
        {/* Sidebar */}
        <aside className='w-72 bg-[#2a3441] p-6 shadow-lg'>
          <h2 className='mb-6 text-xl font-semibold text-teal-400'>
            Your Companies
          </h2>

          {loading ? (
            <div className='flex justify-center py-8'>
              <FiLoader className='animate-spin text-2xl text-teal-400' />
            </div>
          ) : companies.length === 0 ? (
            <p className='py-6 text-center text-gray-400'>
              No companies found. Create your first company!
            </p>
          ) : (
            <ul className='space-y-4'>
              {companies.map((company) => (
                <motion.li
                  key={company.id}
                  className='rounded-md bg-gray-800  transition hover:bg-teal-500/20'
                  whileHover={{ scale: 1.05 }}
                >
                  <button
                    className='flex w-full items-center gap-3 p-3'
                    onClick={() => handleCompanySelect(company)}
                  >
                    <FiUsers className='text-teal-400' />
                    <div className='flex-1'>
                      <span className='block'>{company.name}</span>
                      <span className='text-xs capitalize text-gray-400'>
                        {company.role}
                      </span>
                    </div>
                  </button>
                </motion.li>
              ))}
            </ul>
          )}
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
              onClick={() => setShowCreateModal(true)}
            >
              <FiPlus className='text-2xl' />
              Create Company
            </motion.button>

            {/* Join Company Button */}
            <motion.button
              className='flex items-center gap-3 rounded-lg border border-teal-400 px-6 py-3 text-lg font-medium text-teal-400 transition hover:bg-teal-400 hover:text-[#202731]'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowJoinModal(true)}
            >
              <FiLink className='text-xl' />
              Join Company
            </motion.button>
          </div>
        </main>
      </div>

      {/* Create Company Modal */}
      {showCreateModal && (
        <div className='fixed inset-0 flex items-center justify-center bg-black/50'>
          <motion.div
            className='w-full max-w-md rounded-lg bg-[#2a3441] p-6 shadow-xl'
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-xl font-semibold text-teal-400'>
                Create New Company
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className='text-gray-400 hover:text-white'
              >
                <FiX size={24} />
              </button>
            </div>

            <div className='mb-4'>
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
                className='w-full rounded-md bg-gray-800 p-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-400'
                placeholder='Enter company name'
              />
              {error && <p className='mt-2 text-sm text-red-400'>{error}</p>}
            </div>

            <div className='flex justify-end space-x-4'>
              <button
                onClick={() => setShowCreateModal(false)}
                className='rounded-md px-4 py-2 text-gray-300 hover:text-white'
              >
                Cancel
              </button>
              <motion.button
                onClick={createCompany}
                className='rounded-md bg-teal-400 px-4 py-2 font-medium text-[#202731] hover:bg-teal-500'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Join Company Modal */}
      {showJoinModal && (
        <div className='fixed inset-0 flex items-center justify-center bg-black/50'>
          <motion.div
            className='w-full max-w-md rounded-lg bg-[#2a3441] p-6 shadow-xl'
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-xl font-semibold text-teal-400'>
                Join Company
              </h3>
              <button
                onClick={() => setShowJoinModal(false)}
                className='text-gray-400 hover:text-white'
              >
                <FiX size={24} />
              </button>
            </div>

            <div className='mb-4'>
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
                className='w-full rounded-md bg-gray-800 p-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-400'
                placeholder='Enter company invite code'
              />
              {error && <p className='mt-2 text-sm text-red-400'>{error}</p>}
            </div>

            <div className='flex justify-end space-x-4'>
              <button
                onClick={() => setShowJoinModal(false)}
                className='rounded-md px-4 py-2 text-gray-300 hover:text-white'
              >
                Cancel
              </button>
              <motion.button
                onClick={joinCompany}
                className='rounded-md bg-teal-400 px-4 py-2 font-medium text-[#202731] hover:bg-teal-500'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Join
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Success Modal After Company Creation */}
      {showSuccessModal && newCompany && (
        <div className='fixed inset-0 flex items-center justify-center bg-black/50'>
          <motion.div
            className='w-full max-w-md rounded-lg bg-[#2a3441] p-6 shadow-xl'
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-xl font-semibold text-teal-400'>
                Company Created Successfully
              </h3>
              <button
                onClick={() => setShowSuccessModal(false)}
                className='text-gray-400 hover:text-white'
              >
                <FiX size={24} />
              </button>
            </div>

            <div className='mb-6'>
              <h4 className='mb-2 text-lg font-medium'>{newCompany.name}</h4>
              <p className='mb-4 text-gray-300'>
                Share this invite code with others to join your company:
              </p>

              <div className='mb-4 flex items-center justify-between rounded-md bg-gray-800 p-3'>
                <code className='font-mono text-teal-300'>
                  {newCompany.inviteCode}
                </code>
                <button
                  onClick={copyInviteCode}
                  className='text-gray-400 hover:text-teal-400'
                >
                  {copied ? <FiCheck className='text-green-400' /> : <FiCopy />}
                </button>
              </div>

              <button
                onClick={copyInviteLink}
                className='flex w-full items-center justify-center gap-2 rounded-md bg-gray-700 px-4 py-2 text-gray-200 hover:bg-gray-600'
              >
                <FiLink />
                {copied ? "Copied!" : "Copy Invite Link"}
              </button>
            </div>

            <div className='flex justify-end'>
              <motion.button
                onClick={() => setShowSuccessModal(false)}
                className='rounded-md bg-teal-400 px-4 py-2 font-medium text-[#202731] hover:bg-teal-500'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Done
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Companies;
