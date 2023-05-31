import type { StorybookConfig } from "@storybook/react-webpack5";
import stories from "./stories";

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

    // Default rule for images /\.(svg|ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    const fileLoaderRule = config.module.rules.find(
      (rule) => (rule as any).test && (rule as any).test.test(".svg")
    );
    (fileLoaderRule as any).exclude = /\.svg$/;

    config.module.rules.push({
      test: /\.svg$/i,
      use: ["@svgr/webpack", "url-loader"],
    });

    return config;
  },
};
export default config;
