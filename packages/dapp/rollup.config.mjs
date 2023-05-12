import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import image from "@rollup/plugin-image";
import dts from "rollup-plugin-dts";
import postcss from "rollup-plugin-postcss";
import terser from "@rollup/plugin-terser";

import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const packageJson = require("./package.json");
const externalPackages = [
  ...Object.keys(packageJson.dependencies || {}),
  ...Object.keys(packageJson.peerDependencies || {}),
  ...Object.keys(packageJson.devDependencies || {}),
];

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    external: (id) =>
      externalPackages.some((name) => id === name || id.startsWith(`${name}/`)),
    plugins: [
      resolve(),
      commonjs(),
      image(),
      typescript({
        tsconfig: "./tsconfig.json",
        exclude: [
          "stories/**/*",
          "src/**/*.mdx",
          "src/**/*.stories.@(js|jsx|ts|tsx)",
        ],
      }),
      postcss(),
      terser(),
    ],
  },
  {
    input: "src/index.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts()],
    external: [/\.css$/],
  },
];
