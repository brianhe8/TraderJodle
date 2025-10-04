import express, { type Request, type Response } from "express";

// import * as express from "express";
// import { Request, Response } from "express";

const app = express();
app.get("/", (req: Request, res: Response) => {
  res.send("server is running just fine!");
});
export default app;

app.get("/test", (req: Request, res: Response) => {
  res.send("testing here!");
});
