import { build, emptyDir } from "https://deno.land/x/dnt@0.31.0/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {
    // see JS docs for overview and more options
    deno: "dev",
  },
  compilerOptions: {
    lib: ["es2021", "dom"],
  },
  package: {
    // package.json properties
    name: "@runcitadel/sdk-next",
    version: Deno.args[0],
    description: "Client for the Citadel API",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/runcitadel/sdk-v2.git",
    },
    bugs: {
      url: "https://github.com/runcitadel/sdk-v2/issues",
    },
  },
});

// post build steps
Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");
