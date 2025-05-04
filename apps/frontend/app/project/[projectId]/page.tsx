import axios from "axios";
import { WORKER_URL } from "@/config";
import { Project } from "./Project";

interface Params {
  params: Promise<{ projectId: string }>;
}

export default async function ProjectPage({ params }: Params) {
  const projectId = (await params).projectId;
  const response = await axios.get(`${WORKER_URL}/worker/${projectId}`);
  console.log(response.data);
  const { previewUrl } = response.data;

  return <Project projectId={projectId} previewUrl={previewUrl} />;
}
