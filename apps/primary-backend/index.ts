import { prismaClient } from "db/client";
import express from "express";
import cors from "cors";
import { authMiddleware } from "./middleware";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/project", authMiddleware, async (req, res) => {
  const { prompt } = req.body;
  const userId = req.userId!;
  //MARK:  TODO: add logic to get project name from prompt
  const description = prompt.split("\n")[0];
  const project = await prismaClient.project.create({
    data: {
      description,
      userId,
    },
  });
  res.json({ projectid: project.id });
});

app.get("/projects", authMiddleware, async (req, res) => {
  const userId = req.userId;
  const projects = await prismaClient.project.findMany({
    where: {
      userId,
    },
  });
  res.json({ projects });
});

app.listen(8050, () => {
  console.log("Server is running on port 8080");
});
