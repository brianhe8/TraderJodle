import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import { Pool } from "pg";

// import * as express from "express";
// import { Request, Response } from "express";

dotenv.config();

// Create a pool of connections
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

// Test connection
pool
  .connect()
  .then((client) => {
    console.log("Connected to PostgreSQL");
    client.release(); // must release back to pool
  })
  .catch((err) => console.error("Connection error", err.stack));

// export default pool; only use if diff file

const app = express();
app.get("/", (req: Request, res: Response) => {
  res.send("server is running just fine!");
});
export default app;

app.get("/test", (req: Request, res: Response) => {
  res.send("testing here!");
});

app.get("/items", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM items LIMIT 10;");
    res.json(result.rows);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("database error: ", err.message);
    } else {
      console.error("unexpected error: ", err);
    }
    res.status(500).send("Server error");
  }
});
