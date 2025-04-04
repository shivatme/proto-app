const BASE_WORKER_DIR =
  process.env.BASE_WORKER_DIR || process.cwd() + "/tmp/mobile-app";

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
    console.log(`Running command: ${command}`);
    const result = Bun.spawnSync({
      cmd: command.split(" "),
      cwd: BASE_WORKER_DIR,
    });

    console.log(result.stdout);
    console.log(result.stderr.toString());
  }
}
