import type { StorybookConfig } from "@storybook/react-webpack5";

// Which package directories need to generate storybook
const packageDirs = ["profile"];

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
    // I want to perform the import using @us3r-network/profile directly in the example file
    // Add the `@us3r-network/profile` alias to the Storybook Webpack config.
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias["@us3r-network/profile"] = require.resolve(
      "../packages/profile/src/index.ts"
    );

    return config;
  },
};
export default config;
