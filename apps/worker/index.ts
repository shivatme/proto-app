import cors from "cors";
import express from "express";
import { prismaClient } from "db/client";
import { GoogleGenAI } from "@google/genai";
import { systemPrompt } from "./systemPrompt";

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
    history: [],
  });
  //   const response = client.models
  //     .generateContent({
  //       model: "gemini-2.0-flash",
  //       contents: allPrompts.map((p: any) => ({
  //         role: p.type === "USER" ? "user" : "model",
  //         content: [{ text: p.content }],
  //       })),
  //       config: {
  //         maxOutputTokens: 10000,
  //         temperature: 0.1,
  //         // systemInstruction: systemPrompt("REACT_NATIVE"),
  //       },
  //     })
  //     .then((response) => {
  //       console.log(response);
  //       //Proces and apply the response
  //       // get last mesage and add to db
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  const response = await chat.sendMessage({
    message: prompt,
  });

  console.log(response.text);
  res.json({ response: response.text });
});
app.listen(9091, () => {
  console.log("Server is running on port 9091");
});
