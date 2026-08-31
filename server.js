import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import db from "./db.js";

const app = express();

// Railway will provide PORT automatically in production.
// Locally, TaskFlow will continue using port 3000.
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send("TaskFlow API is running!");
});

// REGISTER
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Please provide name, email and password",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql =
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

    db.query(sql, [name, email, hashedPassword], (err, result) => {
      if (err) {
        console.error(err);

        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({
            message: "Email already exists",
          });
        }

        return res.status(500).json({
          message: "Database error",
        });
      }

      res.status(201).json({
        message: "User registered successfully",
        user_id: result.insertId,
      });
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Please provide email and password",
    });
  }

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Database error",
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = results[0];

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({
      message: "Login successful",
      token,
    });
  });
});

// JWT middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Access denied. No token provided.",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Access denied. Invalid token.",
    });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

// ========================
// PROJECT ROUTES
// ========================

// Get all projects - Public
app.get("/projects", (req, res) => {
  const sql = "SELECT * FROM projects";

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Database error",
      });
    }

    res.json(results);
  });
});

// Create project - Protected
app.post("/projects", verifyToken, (req, res) => {
  const { name, description, user_id } = req.body;

  if (!name || !description || !user_id) {
    return res.status(400).json({
      message: "Please complete all project fields.",
    });
  }

  const sql =
    "INSERT INTO projects (name, description, user_id) VALUES (?, ?, ?)";

  db.query(
    sql,
    [name, description, user_id],
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Database error",
        });
      }

      res.status(201).json({
        message: "Project created successfully",
        project_id: result.insertId,
      });
    }
  );
});

// Update project - Protected
app.put("/projects/:id", verifyToken, (req, res) => {
  const { name, description } = req.body;
  const { id } = req.params;

  if (!name || !description) {
    return res.status(400).json({
      message: "Please complete all project fields.",
    });
  }

  const sql =
    "UPDATE projects SET name = ?, description = ? WHERE id = ?";

  db.query(sql, [name, description, id], (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Database error",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.json({
      message: "Project updated successfully",
    });
  });
});

// Delete project - Protected
app.delete("/projects/:id", verifyToken, (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM projects WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Database error",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.json({
      message: "Project deleted successfully",
    });
  });
});

// ========================
// TASK ROUTES
// ========================

// Get all tasks - Public
app.get("/tasks", (req, res) => {
  const sql = "SELECT * FROM tasks";

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Database error",
      });
    }

    res.json(results);
  });
});

// Create task - Protected
app.post("/tasks", verifyToken, (req, res) => {
  const { title, description, status, project_id } = req.body;

  if (!title || !description || !project_id) {
    return res.status(400).json({
      message: "Please complete all task fields.",
    });
  }

  const taskStatus = status || "Pending";

  const sql =
    "INSERT INTO tasks (title, description, status, project_id) VALUES (?, ?, ?, ?)";

  db.query(
    sql,
    [title, description, taskStatus, project_id],
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Database error",
        });
      }

      res.status(201).json({
        message: "Task created successfully",
        task_id: result.insertId,
      });
    }
  );
});

// Update task - Protected
app.put("/tasks/:id", verifyToken, (req, res) => {
  const { title, description, status, project_id } = req.body;
  const { id } = req.params;

  if (!title || !description || !project_id) {
    return res.status(400).json({
      message: "Please complete all task fields.",
    });
  }

  const sql =
    "UPDATE tasks SET title = ?, description = ?, status = ?, project_id = ? WHERE id = ?";

  db.query(
    sql,
    [title, description, status, project_id, id],
    (err, result) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Database error",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Task not found",
        });
      }

      res.json({
        message: "Task updated successfully",
      });
    }
  );
});

// Delete task - Protected
app.delete("/tasks/:id", verifyToken, (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM tasks WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Database error",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json({
      message: "Task deleted successfully",
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});