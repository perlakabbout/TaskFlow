import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import db from "./db.js";

const app = express();
const PORT = 3000;

// =========================
// MIDDLEWARE
// =========================

app.use(cors());
app.use(express.json());


// =========================
// HOME
// =========================

app.get("/", (req, res) => {
  res.send("TaskFlow API is running!");
});


// =========================
// REGISTER
// =========================

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users (name, email, password)
      VALUES (?, ?, ?)
    `;

    db.query(
      sql,
      [name, email, hashedPassword],
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({
              message: "Email already exists",
            });
          }

          return res.status(500).json({
            error: err.message,
          });
        }

        res.status(201).json({
          message: "User registered successfully",
          user_id: result.insertId,
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});


// =========================
// LOGIN
// =========================

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
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
      token: token,
    });
  });
});


// =========================
// JWT MIDDLEWARE
// =========================

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({
      message: "Invalid token format",
    });
  }

  const token = parts[1];

  jwt.verify(
    token,
    process.env.JWT_SECRET,
    (err, decoded) => {
      if (err) {
        return res.status(403).json({
          message: "Invalid or expired token",
        });
      }

      req.user = decoded;
      next();
    }
  );
};


// =========================
// PROJECTS CRUD
// =========================

// PUBLIC - GET all projects
app.get("/projects", (req, res) => {
  db.query("SELECT * FROM projects", (err, results) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }

    res.json(results);
  });
});


// PROTECTED - CREATE project
app.post("/projects", verifyToken, (req, res) => {
  const { name, description, user_id } = req.body;

  const sql = `
    INSERT INTO projects (name, description, user_id)
    VALUES (?, ?, ?)
  `;

  db.query(
    sql,
    [name, description, user_id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          error: err.message,
        });
      }

      res.status(201).json({
        message: "Project created successfully",
        project_id: result.insertId,
      });
    }
  );
});


// PROTECTED - UPDATE project
app.put("/projects/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const sql = `
    UPDATE projects
    SET name = ?, description = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [name, description, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          error: err.message,
        });
      }

      res.json({
        message: "Project updated successfully",
      });
    }
  );
});


// PROTECTED - DELETE project
app.delete("/projects/:id", verifyToken, (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM projects WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          error: err.message,
        });
      }

      res.json({
        message: "Project deleted successfully",
      });
    }
  );
});


// =========================
// TASKS CRUD
// =========================

// PUBLIC - GET all tasks
app.get("/tasks", (req, res) => {
  db.query("SELECT * FROM tasks", (err, results) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }

    res.json(results);
  });
});


// PROTECTED - CREATE task
app.post("/tasks", verifyToken, (req, res) => {
  const {
    title,
    description,
    status,
    project_id,
  } = req.body;

  const sql = `
    INSERT INTO tasks
    (title, description, status, project_id)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      title,
      description,
      status,
      project_id,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          error: err.message,
        });
      }

      res.status(201).json({
        message: "Task created successfully",
        task_id: result.insertId,
      });
    }
  );
});


// PROTECTED - UPDATE task
app.put("/tasks/:id", verifyToken, (req, res) => {
  const { id } = req.params;

  const {
    title,
    description,
    status,
  } = req.body;

  const sql = `
    UPDATE tasks
    SET title = ?, description = ?, status = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      title,
      description,
      status,
      id,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          error: err.message,
        });
      }

      res.json({
        message: "Task updated successfully",
      });
    }
  );
});


// PROTECTED - DELETE task
app.delete("/tasks/:id", verifyToken, (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM tasks WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          error: err.message,
        });
      }

      res.json({
        message: "Task deleted successfully",
      });
    }
  );
});


// =========================
// START SERVER
// =========================

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});