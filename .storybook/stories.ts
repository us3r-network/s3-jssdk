import path from "path";
const capitalizedStr = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

// product guide
const prodGuide = ["What", "Who", "HowUse", "HowWorks", "QuickStart"];
const prodGuideStories = prodGuide.map((file) => ({
  directory: path.join(__dirname, "docs"),
  files: `${file}.mdx`,
}));

// authorization tools
const authToolPkg = ["auth", "auth-with-rainbowkit"];
const authToolStories = authToolPkg.map((pkgDir) => ({
  titlePrefix: `auth`,
  directory: path.join(__dirname, `../packages/${pkgDir}`),
}));

// model definition
const modelDefDoc = ["Profile", "Link", "Collection", "Dapp"];
const modelDefTitlePrefix = "model definition";
const modelDefDirectory = path.join(__dirname, `../packages/data-model`);
const modelDefStories = modelDefDoc
  // Generate the story navigation bar in the specified order
  .map((file) => {
    const story = {
      titlePrefix: modelDefTitlePrefix,
      directory: modelDefDirectory,
    };
    return [
      {
        ...story,
        directory: `${modelDefDirectory}/stories`,
        files: `${file}.mdx`,
      },
      {
        ...story,
        directory: `${modelDefDirectory}/src`,
        files: `**/${file}.mdx`,
      },
    ];
  })
  .reduce((acc, val) => acc.concat(val), [])
  // unsorted navigation
  .concat([
    {
      titlePrefix: modelDefTitlePrefix,
      directory: `${modelDefDirectory}/stories`,
      files: `**/*.mdx`,
    },
    {
      titlePrefix: modelDefTitlePrefix,
      directory: `${modelDefDirectory}/src`,
      files: `**/*.mdx`,
    },
  ]);

// components
const componentPkgs = ["profile", "link"];
const componentStories = componentPkgs
  .map((dir) => {
    const story = {
      // The group name of the current story
      titlePrefix: `Components/${capitalizedStr(dir)}`,
      // The root directory of the package where the current story is located
      directory: path.join(__dirname, `../packages/${dir}`),
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

export default [
  ...prodGuideStories,
  ...authToolStories,
  ...modelDefStories,
  ...componentStories,
];
