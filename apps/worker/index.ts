import cors from "cors";
import express from "express";
import { prismaClient } from "db/client";
import { GoogleGenAI } from "@google/genai";
import { systemPrompt } from "./systemPrompt";
import { ArtifactProcessor } from "./parser";
import { onFileUpdate, onShellCommand } from "./os";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/prompt", async (req, res) => {
  const { prompt, projectId } = req.body;
  const client = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY,
  });
  const project = await prismaClient.project.findUnique({
    where: {
      id: projectId,
    },
  });
  if (!project) {
    res.status(400).json({ message: "project not found" });
    return;
  }
  const promptDb = await prismaClient.prompt.create({
    data: {
      content: prompt,
      projectId: project.id,
      type: "USER",
    },
  });

  const allPrompts = await prismaClient.prompt.findMany({
    where: {
      projectId: project.id,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  //TODO: aritifact
  const chat = client.chats.create({
    model: "gemini-2.0-flash",
    history: allPrompts.map((p: any) => ({
      role: p.type === "USER" ? "user" : "model",
      content: [{ text: p.content }],
    })),
    config: {
      maxOutputTokens: 10000,
      temperature: 0.1,
      systemInstruction: systemPrompt("REACT_NATIVE"),
    },
  });

  let artifactProcessor = new ArtifactProcessor(
    "",
    onFileUpdate,
    onShellCommand
  );
  let artifact = "";

  const response = await chat.sendMessageStream({
    message: prompt,
  });
  for await (const chunk of response) {
    artifactProcessor.append(chunk.text || "");
    artifactProcessor.parse();
    artifact += chunk.text || "";
    // console.log(chunk.text);
    // console.log("_".repeat(80));
  }
  console.log(response);
  //   res.json({ response: response.text });
});
app.listen(9091, () => {
  console.log("Server is running on port 9091");
});
