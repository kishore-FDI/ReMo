"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Plus,
  X,
  UserPlus,
  Link as LinkIcon,
  Pencil,
  Trash2,
  CheckCircle2,
  Circle,
  Archive,
} from "lucide-react";
import TaskPieChart from "./components/TaskPieChart";

interface Project {
  id: string;
  title: string;
  description: string;
  members: ProjectMember[];
  tasks: Task[];
}

interface ProjectMember {
  id: string;
  memberId: string;
  name: string;
  role: string;
  email: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
  assignedTo: {
    memberId: string;
    name: string;
  };
}

export default function ProjectPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({ title: "", description: "" });
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    role: "",
    email: "",
    memberId: "",
  });
  const [editingMember, setEditingMember] = useState<{
    memberId: string;
  } | null>(null);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    assignedTo: { memberId: "", name: "" },
  });

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };

  // Generate colors for members
  const memberColors = useMemo(() => {
    const colors = [
      "rgba(59, 130, 246, 0.5)", // blue
      "rgba(16, 185, 129, 0.5)", // green
      "rgba(245, 158, 11, 0.5)", // yellow
      "rgba(239, 68, 68, 0.5)", // red
      "rgba(139, 92, 246, 0.5)", // purple
      "rgba(236, 72, 153, 0.5)", // pink
      "rgba(20, 184, 166, 0.5)", // teal
      "rgba(249, 115, 22, 0.5)", // orange
    ];

    const defaultColor = "rgba(156, 163, 175, 0.5)"; // gray as default
    const colorMap: { [key: string]: string } = { default: defaultColor };
    selectedProject?.members.forEach((member, index) => {
      colorMap[member.memberId] = colors[index % colors.length];
    });
    return colorMap;
  }, [selectedProject?.members]);

  const createProject = async () => {
    if (!newProject.title.trim()) return;

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      });

      const project = await response.json();
      setProjects([...projects, project]);
      setSelectedProject(project);
      setShowProjectModal(false);
      setNewProject({ title: "", description: "" });
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  const addMember = async () => {
    if (
      !selectedProject ||
      !newMember.name.trim() ||
      !newMember.memberId.trim()
    )
      return;

    try {
      const response = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newMember,
          projectId: selectedProject.id,
        }),
      });

      const member = await response.json();
      setSelectedProject({
        ...selectedProject,
        members: [...selectedProject.members, member],
      });

      setShowMemberModal(false);
      setNewMember({ name: "", role: "", email: "", memberId: "" });
    } catch (error) {
      console.error("Failed to add member:", error);
    }
  };

  const deleteMember = async (memberId: string) => {
    if (!selectedProject) return;

    try {
      console.log("Deleting member:", memberId);
      const response = await fetch(`/api/members?id=${memberId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(`Failed to delete member: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Delete result:", result);

      setSelectedProject({
        ...selectedProject,
        members: selectedProject.members.filter(
          (member) => member.memberId !== memberId
        ),
        tasks: selectedProject.tasks.filter(
          (task) => task.assignedTo.memberId !== memberId
        ),
      });
    } catch (error) {
      console.error("Failed to delete member:", error);
    }
  };

  const addTask = async () => {
    console.log("Adding new task:", newTask);
    console.log("Selected project:", selectedProject);

    if (
      !selectedProject ||
      !newTask.title.trim() ||
      !newTask.assignedTo.memberId
    ) {
      console.log("Validation failed:", {
        hasSelectedProject: !!selectedProject,
        hasTitle: !!newTask.title.trim(),
        hasAssignedTo: !!newTask.assignedTo.memberId,
      });
      return;
    }

    try {
      const taskData = {
        title: newTask.title,
        description: newTask.description,
        completed: false,
        dueDate: newTask.dueDate,
        assignedTo: newTask.assignedTo.memberId, // Send only the memberId
        projectId: selectedProject.id,
      };
      console.log("Sending task data to API:", taskData);

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(`Failed to add task: ${response.statusText}`);
      }

      const task = await response.json();
      console.log("Received task from API:", task);

      // Transform the task to match our frontend format
      const frontendTask = {
        ...task,
        assignedTo: {
          memberId: task.assignedTo,
          name:
            selectedProject.members.find((m) => m.memberId === task.assignedTo)
              ?.name || "",
        },
      };

      setSelectedProject({
        ...selectedProject,
        tasks: [...selectedProject.tasks, frontendTask],
      });

      setShowTaskModal(false);
      setNewTask({
        title: "",
        description: "",
        dueDate: "",
        assignedTo: { memberId: "", name: "" },
      });
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const updateMember = async () => {
    if (!selectedProject || !editingMember || !newMember.name.trim()) return;

    try {
      console.log("Updating member:", {
        id: editingMember.memberId,
        name: newMember.name,
        role: newMember.role,
        email: newMember.email,
      });

      const response = await fetch("/api/members", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingMember.memberId,
          name: newMember.name,
          role: newMember.role,
          email: newMember.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(
          `Failed to update member: ${errorData.error || response.statusText}`
        );
      }

      const updatedMember = await response.json();
      console.log("Updated member:", updatedMember);

      // Update the member in the project's members list and tasks
      setSelectedProject((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          members: prev.members.map((member) =>
            member.memberId === editingMember.memberId ? updatedMember : member
          ),
          tasks: prev.tasks.map((task) =>
            task.assignedTo.memberId === editingMember.memberId
              ? {
                  ...task,
                  assignedTo: {
                    ...task.assignedTo,
                    name: updatedMember.name,
                  },
                }
              : task
          ),
        };
      });

      setShowMemberModal(false);
      setEditingMember(null);
      setNewMember({ name: "", role: "", email: "", memberId: "" });
    } catch (error) {
      console.error("Failed to update member:", error);
    }
  };

  const toggleTaskCompletion = async (taskId: string, completed: boolean) => {
    if (!selectedProject) return;

    try {
      const response = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: taskId,
          completed: !completed,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(`Failed to update task: ${response.statusText}`);
      }

      const updatedTask = await response.json();
      console.log("Updated task:", updatedTask);

      // Transform the task to match our frontend format
      const frontendTask = {
        ...updatedTask,
        assignedTo: {
          memberId: updatedTask.assignedTo,
          name:
            selectedProject.members.find(
              (m) => m.memberId === updatedTask.assignedTo
            )?.name || "",
        },
      };

      setSelectedProject({
        ...selectedProject,
        tasks: selectedProject.tasks.map((task) =>
          task.id === taskId ? frontendTask : task
        ),
      });
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const startEditingMember = (member: ProjectMember) => {
    setEditingMember({ memberId: member.memberId });
    setNewMember({
      name: member.name,
      role: member.role,
      email: member.email,
      memberId: member.memberId,
    });
    setShowMemberModal(true);
  };

  const generateInviteLink = () => {
    // In a real app, this would generate a unique invite link
    const link = `https://yourdomain.com/invite/${Date.now()}`;
    setInviteLink(link);
  };

  const deleteTask = async (taskId: string, shouldArchive: boolean = false) => {
    if (!selectedProject) return;

    try {
      const response = await fetch(
        `/api/tasks?id=${taskId}${shouldArchive ? "&archive=true" : ""}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(
          `Failed to ${shouldArchive ? "archive" : "delete"} task: ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log(`Task ${shouldArchive ? "archived" : "deleted"}:`, result);

      // Update the UI
      setSelectedProject({
        ...selectedProject,
        tasks: selectedProject.tasks.filter((task) => task.id !== taskId),
      });
    } catch (error) {
      console.error(
        `Failed to ${shouldArchive ? "archive" : "delete"} task:`,
        error
      );
    }
  };

  useEffect(() => {
    console.log(projects);
  }, [projects]);
  return (
    <div className='flex h-screen bg-[#202731]'>
      {/* Side Navigation */}
      <div className='w-64 border-r border-gray-700 bg-[#272F31] shadow-lg'>
        <div className='border-b border-gray-700 p-4'>
          <button
            onClick={() => setShowProjectModal(true)}
            className='flex items-center gap-2 rounded-lg bg-[#3B82F6] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2563EB]'
          >
            <Plus size={16} />
            Add Project
          </button>
        </div>
        <div className='p-2'>
          {projects.length > 0 &&
            projects?.map((project) => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={`cursor-pointer rounded-lg p-2 transition-colors ${
                  selectedProject?.id === project.id
                    ? "bg-[#3B82F6] text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                {project.title}
              </div>
            ))}
        </div>
      </div>

      {/* Project Dashboard */}
      {selectedProject && (
        <div className='flex-1 overflow-y-auto p-6'>
          <div className='mx-auto max-w-6xl'>
            <div className='mb-6 flex items-center justify-between'>
              <div>
                <h1 className='text-2xl font-bold text-white'>
                  {selectedProject.title}
                </h1>
                <p className='text-gray-400'>{selectedProject.description}</p>
              </div>
              <div className='flex gap-2'>
                <button
                  onClick={() => setShowMemberModal(true)}
                  className='flex items-center gap-2 rounded-lg bg-[#3B82F6] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2563EB]'
                >
                  <UserPlus size={16} />
                  Add Member
                </button>
                <button
                  onClick={generateInviteLink}
                  className='flex items-center gap-2 rounded-lg bg-[#3B82F6] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2563EB]'
                >
                  <LinkIcon size={16} />
                  Invite
                </button>
              </div>
            </div>

            {/* Tasks Section */}
            <div className='mb-6'>
              <div className='mb-4 flex items-center justify-between'>
                <h2 className='text-xl font-semibold text-white'>Tasks</h2>
                <div className='flex gap-2'>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className='rounded-lg border border-gray-700 bg-[#272F31] px-3 py-1 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]'
                  >
                    <option value='all'>All Tasks</option>
                    <option value='today'>Today</option>
                    <option value='tomorrow'>Tomorrow</option>
                    <option value='week'>This Week</option>
                  </select>
                  <button
                    onClick={() => setShowTaskModal(true)}
                    className='flex items-center gap-2 rounded-lg bg-[#3B82F6] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2563EB]'
                  >
                    <Plus size={16} />
                    Add Task
                  </button>
                </div>
              </div>
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead>
                    <tr className='text-left text-gray-400'>
                      <th className='p-4'>Status</th>
                      <th className='p-4'>Task</th>
                      <th className='p-4'>Description</th>
                      <th className='p-4'>Assigned To</th>
                      <th className='p-4'>Due Date</th>
                      <th className='p-4'>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProject.tasks?.map((task) => (
                      <tr key={task.id} className='border-t border-gray-700'>
                        <td className='p-4'>
                          <button
                            onClick={() =>
                              toggleTaskCompletion(task.id, task.completed)
                            }
                            className='text-gray-400 hover:text-white'
                          >
                            {task.completed ? (
                              <CheckCircle2
                                size={20}
                                className='text-green-500'
                              />
                            ) : (
                              <Circle size={20} className='text-red-500' />
                            )}
                          </button>
                        </td>
                        <td className='p-4 text-white'>{task.title}</td>
                        <td className='p-4 text-gray-400'>
                          {task.description}
                        </td>
                        <td className='p-4'>
                          <div
                            className='inline-flex items-center rounded px-2 py-1'
                            style={{
                              backgroundColor:
                                memberColors[task.assignedTo?.memberId] ||
                                memberColors.default,
                            }}
                          >
                            <span className='text-white'>
                              {task.assignedTo?.name} (
                              {task.assignedTo?.memberId})
                            </span>
                          </div>
                        </td>
                        <td className='p-4 text-gray-400'>
                          {new Date(task.dueDate).toLocaleDateString()}
                        </td>
                        <td className='p-4'>
                          <div className='flex justify-end gap-2'>
                            <button
                              onClick={() => deleteTask(task.id, true)}
                              className='text-yellow-400 transition-colors hover:text-yellow-300'
                              title='Archive Task'
                            >
                              <Archive size={16} />
                            </button>
                            <button
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "Are you sure you want to delete this task? This action cannot be undone."
                                  )
                                ) {
                                  deleteTask(task.id);
                                }
                              }}
                              className='text-red-400 transition-colors hover:text-red-300'
                              title='Delete Task'
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tasks Overview */}
            <div className='mb-6'>
              <h2 className='mb-4 text-xl font-semibold text-white'>
                Tasks Overview
              </h2>
              <TaskPieChart
                tasks={selectedProject.tasks}
                memberColors={memberColors}
              />
            </div>

            {/* Members Section */}
            <div className='mb-6'>
              <h2 className='mb-4 text-xl font-semibold text-white'>
                Project Members
              </h2>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                {selectedProject.members.map((member) => (
                  <div
                    key={member.id}
                    className='flex items-center justify-between rounded-lg bg-[#272F31] p-4'
                  >
                    <div>
                      <p className='font-medium text-white'>{member.name}</p>
                      <p className='text-sm text-gray-400'>{member.role}</p>
                      <p className='text-sm text-gray-500'>{member.email}</p>
                      <p className='text-xs text-gray-600'>
                        ID: {member.memberId}
                      </p>
                    </div>
                    <div className='flex gap-2'>
                      <button
                        onClick={() => startEditingMember(member)}
                        className='text-gray-400 hover:text-white'
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => deleteMember(member.memberId)}
                        className='text-red-400 hover:text-red-300'
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project Creation Modal */}
      {showProjectModal && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='w-full max-w-md rounded-lg bg-[#272F31] p-6'>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-xl font-semibold text-white'>
                Create New Project
              </h2>
              <button
                onClick={() => setShowProjectModal(false)}
                className='text-gray-400 hover:text-white'
              >
                <X size={20} />
              </button>
            </div>
            <div className='space-y-4'>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-400'>
                  Project Name
                </label>
                <input
                  type='text'
                  value={newProject.title}
                  onChange={(e) =>
                    setNewProject({ ...newProject, title: e.target.value })
                  }
                  className='w-full rounded-lg border border-gray-700 bg-[#202731] px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]'
                  placeholder='Enter project name'
                />
              </div>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-400'>
                  Description
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      description: e.target.value,
                    })
                  }
                  className='w-full rounded-lg border border-gray-700 bg-[#202731] px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]'
                  placeholder='Enter project description'
                  rows={3}
                />
              </div>
              <button
                onClick={createProject}
                className='w-full rounded-lg bg-[#3B82F6] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2563EB]'
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Member Modal */}
      {showMemberModal && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='w-full max-w-md rounded-lg bg-[#272F31] p-6'>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-xl font-semibold text-white'>
                {editingMember ? "Edit Member" : "Add Member"}
              </h2>
              <button
                onClick={() => {
                  setShowMemberModal(false);
                  setEditingMember(null);
                  setNewMember({ name: "", role: "", email: "", memberId: "" });
                }}
                className='text-gray-400 hover:text-white'
              >
                <X size={20} />
              </button>
            </div>
            <div className='space-y-4'>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-400'>
                  Member ID
                </label>
                <input
                  type='text'
                  value={newMember.memberId}
                  onChange={(e) =>
                    setNewMember({ ...newMember, memberId: e.target.value })
                  }
                  className='w-full rounded-lg border border-gray-700 bg-[#202731] px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]'
                  placeholder='Enter member ID'
                  disabled={!!editingMember}
                />
              </div>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-400'>
                  Name
                </label>
                <input
                  type='text'
                  value={newMember.name}
                  onChange={(e) =>
                    setNewMember({ ...newMember, name: e.target.value })
                  }
                  className='w-full rounded-lg border border-gray-700 bg-[#202731] px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]'
                  placeholder='Enter member name'
                />
              </div>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-400'>
                  Role
                </label>
                <input
                  type='text'
                  value={newMember.role}
                  onChange={(e) =>
                    setNewMember({ ...newMember, role: e.target.value })
                  }
                  className='w-full rounded-lg border border-gray-700 bg-[#202731] px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]'
                  placeholder='Enter member role'
                />
              </div>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-400'>
                  Email
                </label>
                <input
                  type='email'
                  value={newMember.email}
                  onChange={(e) =>
                    setNewMember({ ...newMember, email: e.target.value })
                  }
                  className='w-full rounded-lg border border-gray-700 bg-[#202731] px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]'
                  placeholder='Enter member email'
                />
              </div>
              <button
                onClick={editingMember ? updateMember : addMember}
                className='w-full rounded-lg bg-[#3B82F6] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2563EB]'
              >
                {editingMember ? "Update Member" : "Add Member"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Modal */}
      {showTaskModal && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='w-full max-w-md rounded-lg bg-[#272F31] p-6'>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-xl font-semibold text-white'>Add New Task</h2>
              <button
                onClick={() => setShowTaskModal(false)}
                className='text-gray-400 hover:text-white'
              >
                <X size={20} />
              </button>
            </div>
            <div className='space-y-4'>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-400'>
                  Task Name
                </label>
                <input
                  type='text'
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className='w-full rounded-lg border border-gray-700 bg-[#202731] px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]'
                  placeholder='Enter task name'
                />
              </div>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-400'>
                  Description
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  className='w-full rounded-lg border border-gray-700 bg-[#202731] px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]'
                  placeholder='Enter task description'
                  rows={3}
                />
              </div>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-400'>
                  Assign To
                </label>
                <select
                  value={newTask.assignedTo.memberId}
                  onChange={(e) => {
                    const member = selectedProject?.members.find(
                      (m) => m.memberId === e.target.value
                    );
                    setNewTask({
                      ...newTask,
                      assignedTo: {
                        memberId: e.target.value,
                        name: member?.name || "",
                      },
                    });
                  }}
                  className='w-full rounded-lg border border-gray-700 bg-[#202731] px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]'
                >
                  <option value=''>Select a member</option>
                  {selectedProject?.members.map((member) => (
                    <option key={member.memberId} value={member.memberId}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-400'>
                  Due Date
                </label>
                <input
                  type='date'
                  value={newTask.dueDate}
                  onChange={(e) =>
                    setNewTask({ ...newTask, dueDate: e.target.value })
                  }
                  className='w-full rounded-lg border border-gray-700 bg-[#202731] px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]'
                />
              </div>
              <button
                onClick={addTask}
                className='w-full rounded-lg bg-[#3B82F6] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2563EB]'
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Link Modal */}
      {inviteLink && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='w-full max-w-md rounded-lg bg-[#272F31] p-6'>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-xl font-semibold text-white'>Invite Link</h2>
              <button
                onClick={() => setInviteLink(null)}
                className='text-gray-400 hover:text-white'
              >
                <X size={20} />
              </button>
            </div>
            <div className='space-y-4'>
              <div className='flex items-center gap-2 rounded-lg border border-gray-700 bg-[#202731] p-3'>
                <input
                  type='text'
                  value={inviteLink}
                  readOnly
                  className='flex-1 bg-transparent text-white focus:outline-none'
                />
                <button
                  onClick={() => navigator.clipboard.writeText(inviteLink)}
                  className='text-sm text-[#3B82F6] hover:text-[#2563EB]'
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
