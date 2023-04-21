import type { StorybookConfig } from "@storybook/react-webpack5";

// Which package directories need to generate storybook
const packageDirs = ["profile", "link"];

const stories = packageDirs
  .map((dir) => {
    const story = {
      // The group name of the current story
      titlePrefix: `s3 ${dir}`,
      // The root directory of the package where the current story is located
      directory: `../packages/${dir}`,
      // Files that need to generate stories
      files: `src/**/*.{stories.@(js|jsx|ts|tsx),mdx}`,
    };
    /**
     * Generate the story navigation bar in the specified order
     * order : Introduction, Components, Examples, ...
     */
    return [
      // Introduction
      {
        ...story,
        files: `stories/**/Introduction.mdx`,
      },
      // Components
      {
        ...story,
        files: `src/**/*.{stories.@(js|jsx|ts|tsx),mdx}`,
      },
      // Examples
      {
        ...story,
        files: `stories/**/*.{stories.@(js|jsx|ts|tsx),mdx}`,
      },
    ];
  })
  .reduce((acc, val) => acc.concat(val), []);

const webpackAlias = [
  {
    name: "@us3r-network/auth",
    path: "../packages/auth/src/index.ts",
  },
  {
    name: "@us3r-network/auth-with-rainbowkit",
    path: "../packages/auth-with-rainbowkit/src/index.ts",
  },
  {
    name: "@us3r-network/data-model",
    path: "../packages/data-model/src/index.ts",
  },
  {
    name: "@us3r-network/profile",
    path: "../packages/profile/src/index.ts",
  },
  {
    name: "@us3r-network/link",
    path: "../packages/link/src/index.ts",
  },
];

const config: StorybookConfig = {
  stories,
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  webpackFinal(config, options) {
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    for (const alias of webpackAlias) {
      config.resolve.alias[alias.name] = require.resolve(alias.path);
    }

    return config;
  },
};
export default config;
