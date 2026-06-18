import { spawnSync } from "node:child_process";

const result = spawnSync("npx", ["next", "build"], {
  env: {
    ...process.env,
    GITHUB_PAGES: "true"
  },
  shell: true,
  stdio: "inherit"
});

process.exit(result.status ?? 1);
