"use client";

import { Header } from "@/components/Header";
import { PreviewIframe } from "@/components/PreviewIframe";
import { SidebarInset } from "@/components/ui/sidebar";
import { WORKER_URL } from "@/config";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { SquarePen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export const Project: React.FC<{ projectId: string; previewUrl: string }> = ({
  projectId,
  previewUrl,
}) => {
  const router = useRouter();

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
    <div className="grid h-screen w-full grid-cols-1 md:grid-cols-[auto_1fr]">
      <div className="flex flex-col justify-between p-4 gap-2 rounded-md w-full xl:w-[400px] 2xl:w-[500px] max-w-full overflow-hidden">
        <Header onClick={() => router.push("/")}>
          <SquarePen />
        </Header>
      </div>
      <div className="flex flex-col justify-between p-4 gap-2 rounded-md w-full max-w-full overflow-hidden">
        <div className="flex items-center justify-start">
          <div className="flex items-center gap-2">
            <div className="inline-block rounded-full border dark:border-gray-300/20 p-1 h-fit">
              <div className="w-2 h-2 rounded-full flex-shrink-0 bg-teal-300 dark:bg-teal-300/30" />
            </div>
            <p>Project</p>
          </div>
        </div>

        <PreviewIframe url={previewUrl} />
      </div>
    </div>
  );
};
