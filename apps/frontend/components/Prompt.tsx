"use client";

import { Send } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./Textarea";
import axios from "axios";
import { useState } from "react";
import { headers } from "next/headers";
import { useAuth } from "@clerk/nextjs";
import { BACKEND_URL } from "@/config";

export function Prompt() {
  const [prompt, setPrompt] = useState("");
  const { getToken } = useAuth();
  return (
    <div>
      <Textarea
        placeholder="Enter your prompt here"
        className="w-full h-full"
        value={prompt}
        onChange={(e) => {
          setPrompt(e.target.value);
        }}
      />
      <div className="flex justify-end pt-2">
        <Button
          onClick={async () => {
            const token = await getToken();
            const response = await axios.post(
              `${BACKEND_URL}/project`,
              {
                prompt: prompt,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          }}
        >
          <Send />
        </Button>
      </div>
    </div>
  );
}
