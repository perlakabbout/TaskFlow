import { useEffect, useState } from "react";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");

  const loadProjects = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3000/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load projects");
      }

      const data = await response.json();
      setProjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !description.trim()) {
      setError("Please complete all project fields.");
      return;
    }

    setSaving(true);

    try {
      const url = editingId
        ? `http://localhost:3000/projects/${editingId}`
        : "http://localhost:3000/projects";

      const method = editingId ? "PUT" : "POST";

      const body = editingId
        ? { name, description }
        : { name, description, user_id: 1 };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(
          editingId
            ? "Failed to update project"
            : "Failed to create project"
        );
      }

      setName("");
      setDescription("");
      setEditingId(null);

      await loadProjects();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (project) => {
    setEditingId(project.id);
    setName(project.name);
    setDescription(project.description);
    setError("");
  };

  const handleDelete = async (id) => {
    setError("");

    try {
      const response = await fetch(
        `http://localhost:3000/projects/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      await loadProjects();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Projects</h1>

      <h2>{editingId ? "Update Project" : "Create Project"}</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Project Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button type="submit" disabled={saving}>
          {saving
            ? "Saving..."
            : editingId
              ? "Update Project"
              : "Create Project"}
        </button>
      </form>

      {error && <p>{error}</p>}

      <h2>Project List</h2>

      {loading ? (
        <p>Loading projects...</p>
      ) : (
        projects.map((project) => (
          <div key={project.id}>
            <h3>{project.name}</h3>
            <p>{project.description}</p>

            <button onClick={() => handleEdit(project)}>
              Edit
            </button>

            <button onClick={() => handleDelete(project.id)}>
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Projects;