"use client";

import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Project = {
  id: number;
  name: string;
  description: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/projects`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load projects");
        }

        return response.json();
      })
      .then((data) => {
        setProjects(data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  return (
    <main>
      <h1>TaskFlow Projects</h1>

      {error && <p>{error}</p>}

      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          id={project.id}
          name={project.name}
          description={project.description}
        />
      ))}
    </main>
  );
}