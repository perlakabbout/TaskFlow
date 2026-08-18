import express from "express";
import db from "./db.js";

const app = express();
const PORT = 3000;

app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.send("TaskFlow API is running!");
});


// =========================
// PROJECTS CRUD
// =========================

// GET all projects
app.get("/projects", (req, res) => {
    db.query("SELECT * FROM projects", (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json(results);
    });
});

// POST create project
app.post("/projects", (req, res) => {
    const { name, description, user_id } = req.body;

    const sql = `
        INSERT INTO projects (name, description, user_id)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [name, description, user_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.status(201).json({
            message: "Project created successfully",
            project_id: result.insertId
        });
    });
});

// PUT update project
app.put("/projects/:id", (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    const sql = `
        UPDATE projects
        SET name = ?, description = ?
        WHERE id = ?
    `;

    db.query(sql, [name, description, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json({
            message: "Project updated successfully"
        });
    });
});

// DELETE project
app.delete("/projects/:id", (req, res) => {
    const { id } = req.params;

    db.query(
        "DELETE FROM projects WHERE id = ?",
        [id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json({
                message: "Project deleted successfully"
            });
        }
    );
});


// =========================
// TASKS CRUD
// =========================

// GET all tasks
app.get("/tasks", (req, res) => {
    db.query("SELECT * FROM tasks", (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json(results);
    });
});

// POST create task
app.post("/tasks", (req, res) => {
    const { title, description, status, project_id } = req.body;

    const sql = `
        INSERT INTO tasks (title, description, status, project_id)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [title, description, status, project_id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.status(201).json({
                message: "Task created successfully",
                task_id: result.insertId
            });
        }
    );
});

// PUT update task
app.put("/tasks/:id", (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const sql = `
        UPDATE tasks
        SET title = ?, description = ?, status = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [title, description, status, id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json({
                message: "Task updated successfully"
            });
        }
    );
});

// DELETE task
app.delete("/tasks/:id", (req, res) => {
    const { id } = req.params;

    db.query(
        "DELETE FROM tasks WHERE id = ?",
        [id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json({
                message: "Task deleted successfully"
            });
        }
    );
});


// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});