"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Project = {
  id: number;
  name: string;
  description: string;
};

type Task = {
  id: number;
  title: string;
  description: string;
  status: string;
  project_id: number;
};

export default function ProjectDetailsPage() {
  const params = useParams();
  const id = Number(params.id);

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjectDetails = async () => {
      try {
        const [projectsResponse, tasksResponse] = await Promise.all([
          fetch(`${API_URL}/projects`),
          fetch(`${API_URL}/tasks`),
        ]);

        if (!projectsResponse.ok || !tasksResponse.ok) {
          throw new Error("Failed to load project details");
        }

        const projects: Project[] = await projectsResponse.json();
        const allTasks: Task[] = await tasksResponse.json();

        const selectedProject = projects.find(
          (project) => project.id === id
        );

        if (!selectedProject) {
          throw new Error("Project not found");
        }

        const projectTasks = allTasks.filter(
          (task) => task.project_id === id
        );

        setProject(selectedProject);
        setTasks(projectTasks);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProjectDetails();
  }, [id]);

  if (loading) {
    return (
      <main>
        <p>Loading project...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <h1>{error}</h1>
        <Link href="/projects">Back to Projects</Link>
      </main>
    );
  }

  return (
    <main>
      <h1>{project?.name}</h1>

      <p>{project?.description}</p>

      <h2>Tasks</h2>

      {tasks.length === 0 ? (
        <p>No tasks for this project.</p>
      ) : (
        tasks.map((task) => (
          <div key={task.id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
          </div>
        ))
      )}

      <Link href="/projects">Back to Projects</Link>
    </main>
  );
}