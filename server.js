import express from "express";
import db from "./db.js";

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
    res.send("TaskFlow API is running!");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});