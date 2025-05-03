const BASE_WORKER_DIR = process.env.BASE_WORKER_DIR || "/tmp/app";

if (!Bun.file(BASE_WORKER_DIR).exists()) {
  Bun.write(BASE_WORKER_DIR, "");
}

export async function onFileUpdate(filePath: string, fileContent: string) {
  const res = await Bun.write(`${BASE_WORKER_DIR}/${filePath}`, fileContent);
  console.log("File updated:", `${BASE_WORKER_DIR}/${filePath}`);
}
export async function onShellCommand(shellCommand: string) {
  const commands = shellCommand.split("&&");

  for (const command of commands) {
    const trimmed = command.trim();
    if (!trimmed) continue;

    console.log(`Running command: ${trimmed}`);

    const result = Bun.spawnSync({
      cmd: trimmed.split(" "),
      cwd: BASE_WORKER_DIR,
    });

    console.log(new TextDecoder().decode(result.stdout));
    console.error(new TextDecoder().decode(result.stderr));
  }
}
