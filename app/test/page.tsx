"use client";

import { useState, useEffect } from "react";
import { Project } from "@prisma/client";

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch all projects
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data);
      setMessage("Projects fetched successfully");
    } catch (error) {
      setMessage("Error fetching projects");
    } finally {
      setLoading(false);
    }
  };

  // Create a project
  const createProject = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
      });
      const data = await res.json();
      setProjects([...projects, data]);
      setMessage("Project created successfully");
    } catch (error) {
      setMessage("Error creating project");
    } finally {
      setLoading(false);
    }
  };

  // Update a project
  const updateProject = async () => {
    if (!selectedProject) {
      setMessage("Please select a project first");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${selectedProject}`, {
        method: "PATCH",
      });
      const data = await res.json();

      // Update the projects array
      const updatedProjects = projects.map((project) =>
        project.id === selectedProject ? data : project
      );

      setProjects(updatedProjects);
      setMessage("Project updated successfully");
    } catch (error) {
      setMessage("Error updating project");
    } finally {
      setLoading(false);
    }
  };

  // Delete a project
  const deleteProject = async () => {
    if (!selectedProject) {
      setMessage("Please select a project first");
      return;
    }

    setLoading(true);
    try {
      await fetch(`/api/projects/${selectedProject}`, {
        method: "DELETE",
      });

      // Remove the project from the projects array
      const filteredProjects = projects.filter(
        (project) => project.id !== selectedProject
      );
      setProjects(filteredProjects);
      setSelectedProject(null);
      setMessage("Project deleted successfully");
    } catch (error) {
      setMessage("Error deleting project");
    } finally {
      setLoading(false);
    }
  };

  // Load projects on initial render
  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className='mx-auto max-w-4xl p-8'>
      <h1 className='mb-6 text-3xl font-bold'>Project CRUD Operations</h1>

      <div className='mb-8 flex space-x-4'>
        <button
          onClick={fetchProjects}
          className='rounded bg-blue-500 px-4 py-2 text-white'
          disabled={loading}
        >
          Get All Projects
        </button>

        <button
          onClick={createProject}
          className='rounded bg-green-500 px-4 py-2 text-white'
          disabled={loading}
        >
          Create Project
        </button>

        <button
          onClick={updateProject}
          className='rounded bg-yellow-500 px-4 py-2 text-white'
          disabled={loading || !selectedProject}
        >
          Update Project
        </button>

        <button
          onClick={deleteProject}
          className='rounded bg-red-500 px-4 py-2 text-white'
          disabled={loading || !selectedProject}
        >
          Delete Project
        </button>
      </div>

      {message && (
        <div className='mb-4 rounded border bg-gray-100 p-3'>{message}</div>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <h2 className='mb-3 text-xl font-semibold'>Projects List</h2>

          {projects.length === 0 ? (
            <p>No projects found</p>
          ) : (
            <div className='grid gap-4'>
              {/* {projects?.map((project) => (
                <div
                  key={project.id}
                  className={`cursor-pointer rounded border p-4 ${
                    selectedProject === project.id
                      ? "border-blue-500 bg-blue-100"
                      : ""
                  }`}
                  onClick={() => setSelectedProject(project.id)}
                >
                  <h3 className='font-bold'>{project.title}</h3>
                  <p className='text-gray-600'>
                    {project.description || "No description"}
                  </p>
                  <p className='mt-2 text-xs text-gray-500'>
                    Created: {new Date(project.createdAt).toLocaleString()}
                  </p>
                  <p className='text-xs text-gray-500'>ID: {project.id}</p>
                </div>
              ))} */}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
