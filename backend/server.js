const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to PostgreSQL
const db = new Pool({
  user: "postgres",
  password: "victor",
  host: "localhost",
  port: 5432,
  database: "quizdb"
});

// Route to record attempts
app.post("/record", async (req, res) => {
  const { question, attemptNumber, answer, correct } = req.body;

  try {
    await db.query(
      "INSERT INTO quiz_attempts (question, attempt_number, answer, correct) VALUES ($1, $2, $3, $4)",
      [question, attemptNumber, answer, correct]
    );

    res.json({ status: "saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "database error" });
  }
});

// Start server
app.listen(3000, () => {
  console.log("Backend running on http://localhost:3000");
});
