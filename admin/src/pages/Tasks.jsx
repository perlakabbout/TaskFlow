import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [projectId, setProjectId] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");

  const loadTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load tasks");
      }

      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetch(`${API_URL}/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
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
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !description.trim()) {
      setError("Please complete all task fields.");
      return;
    }

    if (!editingId && !projectId) {
      setError("Please enter a Project ID.");
      return;
    }

    setSaving(true);

    try {
      const url = editingId
        ? `${API_URL}/tasks/${editingId}`
        : `${API_URL}/tasks`;

      const method = editingId ? "PUT" : "POST";

      const body = editingId
        ? {
            title,
            description,
            status,
          }
        : {
            title,
            description,
            status,
            project_id: Number(projectId),
          };

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
            ? "Failed to update task"
            : "Failed to create task"
        );
      }

      setTitle("");
      setDescription("");
      setStatus("Pending");
      setProjectId(1);
      setEditingId(null);

      await loadTasks();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (task) => {
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setError("");
  };

  const handleDelete = async (id) => {
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/tasks/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Tasks</h1>

      <h2>
        {editingId ? "Update Task" : "Create Task"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Task Title:</label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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

        <div>
          <label>Status:</label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {!editingId && (
          <div>
            <label>Project ID:</label>

            <input
              type="number"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            />
          </div>
        )}

        <button type="submit" disabled={saving}>
          {saving
            ? "Saving..."
            : editingId
              ? "Update Task"
              : "Create Task"}
        </button>
      </form>

      {error && <p>{error}</p>}

      <h2>Task List</h2>

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        tasks.map((task) => (
          <div key={task.id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>

            <button onClick={() => handleEdit(task)}>
              Edit
            </button>

            <button onClick={() => handleDelete(task.id)}>
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Tasks;