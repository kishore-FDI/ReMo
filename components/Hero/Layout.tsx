import React, { useState, useEffect } from "react";
import { SignOutButton } from "@clerk/nextjs";
import { useCompany } from "@/context/CompanyContext";
import {
  FaHome,
  FaChalkboard,
  FaVideo,
  FaTasks,
  FaUser,
  FaCog,
  FaBell,
  FaCalendarAlt,
  FaProjectDiagram,
  FaUsers,
  FaClock,
  FaChartLine,
  FaEnvelope,
  FaSignOutAlt,
} from "react-icons/fa";
import Home from "../WhiteBoard";
import ProjectPage from "@/app/projectmanagement/page";

const Layout = ({ user }: any) => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const { selectedCompany } = useCompany();

  const navItems = [
    { id: "dashboard", title: "Dashboard", icon: <FaHome /> },
    { id: "whiteboard", title: "Whiteboard", icon: <FaChalkboard /> },
    { id: "meeting", title: "Virtual Meeting", icon: <FaVideo /> },
    { id: "projects", title: "Project Management", icon: <FaTasks /> },
  ];

  const stats = [
    {
      title: "Active Projects",
      value: "12",
      icon: <FaProjectDiagram />,
      color: "bg-blue-500/10",
      textColor: "text-blue-400",
    },
    {
      title: "Team Members",
      value: "24",
      icon: <FaUsers />,
      color: "bg-green-500/10",
      textColor: "text-green-400",
    },
    {
      title: "Hours Logged",
      value: "156",
      icon: <FaClock />,
      color: "bg-purple-500/10",
      textColor: "text-purple-400",
    },
    {
      title: "Productivity",
      value: "92%",
      icon: <FaChartLine />,
      color: "bg-amber-500/10",
      textColor: "text-amber-400",
    },
  ];

  const recentActivities = [
    {
      title: "Updated Whiteboard Project",
      time: "2 hours ago",
      icon: <FaChalkboard />,
      color: "bg-blue-500/10",
      textColor: "text-blue-400",
    },
    {
      title: "Team Meeting Scheduled",
      time: "3 hours ago",
      icon: <FaVideo />,
      color: "bg-green-500/10",
      textColor: "text-green-400",
    },
    {
      title: "Project Milestone Completed",
      time: "5 hours ago",
      icon: <FaTasks />,
      color: "bg-purple-500/10",
      textColor: "text-purple-400",
    },
  ];

  return (
    <div className='flex h-screen bg-gray-900 text-gray-100'>
      {/* Sidebar */}
      <div
        className={`fixed z-10 h-full bg-gray-800 transition-all duration-300 ease-in-out ${
          sidebarExpanded ? "w-64" : "w-20"
        }`}
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
      >
        {/* Logo area */}
        <div className='flex h-16 items-center justify-center border-b border-gray-700'>
          <span
            className={`text-xl font-bold ${sidebarExpanded ? "block" : "hidden"}`}
          >
            Dashboard
          </span>
          <span
            className={`text-2xl font-bold ${sidebarExpanded ? "hidden" : "block"}`}
          >
            D
          </span>
        </div>

        {/* Nav items */}
        <div className='py-6'>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex w-full items-center px-4 py-3 transition-colors ${
                activeSection === item.id
                  ? "border-l-4 border-blue-500 bg-blue-600/20 text-blue-400"
                  : "border-l-4 border-transparent text-gray-400 hover:bg-gray-700/50 hover:text-gray-200"
              }`}
            >
              <div className='flex h-10 w-10 items-center justify-center'>
                {React.cloneElement(item.icon, { className: "w-5 h-5" })}
              </div>
              <span
                className={`ml-4 font-medium transition-opacity ${
                  sidebarExpanded ? "opacity-100" : "opacity-0"
                }`}
              >
                {item.title}
              </span>
            </button>
          ))}
        </div>

        {/* Bottom menu items */}
        <div className='absolute bottom-0 left-0 right-0 border-t border-gray-700 py-4'>
          {/* <button
            onClick={() => setActiveSection("profile")}
            className={`flex w-full items-center px-4 py-3 transition-colors ${
              activeSection === "profile"
                ? "border-l-4 border-blue-500 bg-blue-600/20 text-blue-400"
                : "border-l-4 border-transparent text-gray-400 hover:bg-gray-700/50 hover:text-gray-200"
            }`}
          >
            <div className='flex h-10 w-10 items-center justify-center'>
              <FaUser className='h-5 w-5' />
            </div>
            <span
              className={`ml-4 font-medium transition-opacity ${
                sidebarExpanded ? "opacity-100" : "opacity-0"
              }`}
            >
              Profile
            </span>
          </button> */}

          <button
            onClick={() => setActiveSection("settings")}
            className={`flex w-full items-center px-4 py-3 transition-colors ${
              activeSection === "settings"
                ? "border-l-4 border-blue-500 bg-blue-600/20 text-blue-400"
                : "border-l-4 border-transparent text-gray-400 hover:bg-gray-700/50 hover:text-gray-200"
            }`}
          >
            <div className='flex h-10 w-10 items-center justify-center'>
              <FaCog className='h-5 w-5' />
            </div>
            <span
              className={`ml-4 font-medium transition-opacity ${
                sidebarExpanded ? "opacity-100" : "opacity-0"
              }`}
            >
              Settings
            </span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div
        className={`flex-1 transition-all duration-300 ${sidebarExpanded ? "ml-64" : "ml-20"}`}
      >
        {/* Top navbar */}
        <div className='flex h-16 items-center justify-between border-b border-gray-700 bg-gray-800 px-6'>
          <div className='text-xl font-medium'>
            {navItems.find((item) => item.id === activeSection)?.title ||
            activeSection === "profile"
              ? "Profile"
              : activeSection === "settings"
                ? "Settings"
                : "Dashboard"}
          </div>

          <div className='flex items-center space-x-4'>
            <button className='relative rounded-full p-2 hover:bg-gray-700'>
              <FaBell className='h-5 w-5 text-gray-400' />
              <span className='absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500'></span>
            </button>

            <div className='flex items-center space-x-3'>
              <div className='hidden text-right md:block'>
                <div className='text-sm font-medium'>
                  {user?.firstName} {user?.lastName}
                </div>
                <div className='text-xs text-gray-400'>
                  {selectedCompany?.name || "No company selected"}
                </div>
              </div>

              <div className='h-10 w-10 overflow-hidden rounded-full bg-gray-700'>
                <img
                  src={user?.imageUrl || "/default-avatar.png"}
                  alt='User avatar'
                  className='h-full w-full object-cover'
                />
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div
          className='overflow-auto p-6'
          style={{ height: "calc(100vh - 64px)" }}
        >
          {activeSection === "settings" ? (
            <div className='mx-auto max-w-4xl space-y-6'>
              {/* Profile header */}
              <div className='overflow-hidden rounded-lg border border-gray-700 bg-gray-800'>
                <div className='h-32 bg-gradient-to-r from-blue-600/30 to-purple-600/30'></div>
                <div className='relative px-6 pb-6'>
                  <div className='absolute -top-16 flex items-start'>
                    <div className='h-32 w-32 overflow-hidden rounded-xl border-4 border-gray-800'>
                      <img
                        src={user?.imageUrl || "/default-avatar.png"}
                        alt='User avatar'
                        className='h-full w-full object-cover'
                      />
                    </div>
                    <div className='ml-4 pt-5'>
                      <h2 className='text-2xl font-bold text-white'>
                        {user?.firstName} {user?.lastName}
                      </h2>
                      <p className='text-gray-400'>
                        {user?.primaryEmailAddress?.emailAddress}
                      </p>
                      <span className='flex items-center text-gray-400'>
                        <FaCalendarAlt className='mr-2 text-blue-400' />
                        Last login:{" "}
                        {user?.lastSignInAt
                          ? new Date(user.lastSignInAt).toLocaleString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className='mt-16 flex items-center justify-between'>
                    <div className='flex items-center space-x-4 text-sm'>
                      {selectedCompany && (
                        <span className='flex items-center rounded-full bg-gray-700 px-3 py-1'>
                          <FaProjectDiagram className='mr-2 text-green-400' />
                          {selectedCompany.name}
                        </span>
                      )}
                    </div>

                    <SignOutButton>
                      <button className='flex items-center rounded-lg bg-gray-700 px-4 py-2 text-red-400 transition-colors hover:bg-red-500/10'>
                        <FaSignOutAlt className='mr-2 h-4 w-4' />
                        Sign Out
                      </button>
                    </SignOutButton>
                  </div>
                </div>
              </div>
            </div>
          ) : activeSection === "whiteboard" ? (
            <Home user={user} />
          ) : activeSection === "projects" ? (
            <ProjectPage />
          ) : activeSection === "dashboard" ? (
            <div className='mx-auto max-w-4xl space-y-6'>
              {/* Welcome card */}
              <div className='rounded-lg border border-gray-700 bg-gray-800 p-6'>
                <h2 className='mb-2 text-2xl font-bold'>
                  Welcome back, {user?.firstName || "User"}!
                </h2>
                <p className='text-gray-400'>
                  Here&apos;s what&apos;s happening with your projects today.
                </p>

                <div className='mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
                  {stats.map((stat) => (
                    <div
                      key={stat.title}
                      className='rounded-lg bg-gray-700/50 p-4'
                    >
                      <div className='flex items-center'>
                        <div
                          className={`mr-4 rounded-lg ${stat.color} p-2 ${stat.textColor}`}
                        >
                          {React.cloneElement(stat.icon, {
                            className: "h-5 w-5",
                          })}
                        </div>
                        <div>
                          <p className='text-sm text-gray-400'>{stat.title}</p>
                          <p className='text-xl font-bold'>{stat.value}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent activity */}
              <div className='overflow-hidden rounded-lg border border-gray-700 bg-gray-800'>
                <div className='border-b border-gray-700 px-6 py-4'>
                  <h3 className='text-lg font-bold'>Recent Activity</h3>
                </div>

                <div className='divide-y divide-gray-700/50'>
                  {recentActivities.map((activity, index) => (
                    <div
                      key={index}
                      className='flex items-center px-6 py-4 transition-colors hover:bg-gray-700/30'
                    >
                      <div
                        className={`mr-4 rounded-lg p-2 ${activity.color} ${activity.textColor}`}
                      >
                        {React.cloneElement(activity.icon, {
                          className: "h-4 w-4",
                        })}
                      </div>
                      <div className='flex-1'>
                        <p className='text-sm font-medium'>{activity.title}</p>
                        <p className='text-xs text-gray-400'>{activity.time}</p>
                      </div>
                      <button className='rounded-lg bg-gray-700 p-2 text-gray-400 hover:text-white'>
                        <FaEnvelope className='h-4 w-4' />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className='flex h-full items-center justify-center'>
              <div className='text-center'>
                <div className='mb-4 inline-flex h-16 w-16 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400'>
                  {navItems.find((item) => item.id === activeSection)?.icon || (
                    <FaHome />
                  )}
                </div>
                <h2 className='mb-2 text-2xl font-bold'>
                  {navItems.find((item) => item.id === activeSection)?.title ||
                    "Coming Soon"}
                </h2>
                <p className='text-gray-400'>
                  This feature is currently in development.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Layout;
