"use client";

import { Header } from "@/components/Header";
import { PreviewIframe } from "@/components/PreviewIframe";
import { Textarea } from "@/components/Textarea";
import { Button } from "@/components/ui/button";
import { SidebarInset } from "@/components/ui/sidebar";
import { WORKER_URL } from "@/config";
import { usePrompts } from "@/hooks/usePrompts";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { Send, SquarePen } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export const Project: React.FC<{ projectId: string; previewUrl: string }> = ({
  projectId,
  previewUrl,
}) => {
  const router = useRouter();
  const { prompts } = usePrompts(projectId);
  const [tab, setTab] = useState("preview");

  const [prompt, setPrompt] = useState("");
  const { getToken } = useAuth();
  const { user } = useUser();

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const token = await getToken();
      axios.post(
        `${WORKER_URL}/prompt`,
        {
          projectId: projectId,
          prompt: prompt,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPrompt("");
    },
    [projectId, getToken, prompt]
  );

  return (
    <SidebarInset className="bg-transparent">
      <div className="grid h-screen w-full grid-cols-1 md:grid-cols-[auto_1fr]">
        <div className="flex flex-col justify-between p-4 gap-2 rounded-md w-full xl:w-[400px] 2xl:w-[500px] max-w-full overflow-hidden">
          <div className="flex items-center justify-start">
            <Header onClick={() => router.push("/")}>
              <SquarePen />
            </Header>
          </div>
          <div className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 min-h-0 overflow-y-auto">
              <div className="flex flex-col space-y-4 justify-center">
                {prompts.map((prompt) => (
                  <div key={prompt.id}>
                    <span key={prompt.id} className="flex text-lg gap-2">
                      {prompt.content}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <form
              onSubmit={(e) => onSubmit(e)}
              className="relative w-full border-2 bg-gray-500/10 focus-within:outline-1 focus-within:outline-teal-300/30 rounded-xl"
            >
              <div className="p-2">
                <Textarea
                  value={prompt}
                  placeholder="Write a prompt..."
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full placeholder:text-gray-400/60 shadow-none bg-transparent border-none text-md rounded-none focus-visible:ring-0 min-h-16 max-h-80 resize-none outline-none"
                />
              </div>
              <div className="p-2 flex items-center justify-end">
                <Button
                  type="submit"
                  className="h-10 w-10 cursor-pointer rounded-full bg-teal-200/10 hover:bg-teal-300/20 flex items-center justify-center"
                  disabled={!prompt}
                >
                  <Send className="w-10 h-10 text-teal-300/70" />
                </Button>
              </div>
            </form>
          </div>
        </div>
        <div className="flex-1 min-w-0 overflow-hidden p-4">
          {/* <div className="flex items-center justify-end gap-2 pb-2">
            <Button
              variant={tab === "code" ? "default" : "outline"}
              onClick={() => setTab("code")}
            >
              Code
            </Button>
            <Button
              variant={tab === "preview" ? "default" : "outline"}
              onClick={() => setTab("preview")}
            >
              Preview
            </Button>
            <Button variant="outline" onClick={() => setTab("split")}>
              Split
            </Button>
          </div> */}
          <div className="flex gap-2 h-full">
            <div
              className={`${tab === "code" ? "left-0 flex-1" : tab === "split" ? "left-0 flex-1" : "left-full flex-0"} position-absolute transition-all duration-300 h-full w-full`}
            >
              {/* <iframe
                            src={`${sessionUrl}/`}
                            className="w-full h-full rounded-lg"
                            title="Project Worker"
                        /> */}
            </div>
            <div
              className={`${tab === "preview" ? "left-0 flex-1" : tab === "split" ? "left-0 flex-1" : "left-full flex-0"} position-absolute transition-all duration-300 h-full w-full`}
            >
              <PreviewIframe url={`${previewUrl}`} />
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
};
