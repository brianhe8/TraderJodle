import express, {} from "express";
// import * as express from "express";
// import { Request, Response } from "express";
const app = express();
app.get("/", (req, res) => {
    res.send("server is running just fine!");
});
export default app;
//# sourceMappingURL=server.js.map