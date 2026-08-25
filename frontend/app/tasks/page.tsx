"use client";

import { useEffect, useState } from "react";

type Task = {
  id: number;
  title: string;
  description: string;
  status: string;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/tasks")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load tasks");
        }

        return response.json();
      })
      .then((data) => {
        setTasks(data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  return (
    <main>
      <h1>TaskFlow Tasks</h1>

      {error && <p>{error}</p>}

      {tasks.map((task) => (
        <div key={task.id}>
          <h2>{task.title}</h2>
          <p>{task.description}</p>
          <p>Status: {task.status}</p>
        </div>
      ))}
    </main>
  );
}