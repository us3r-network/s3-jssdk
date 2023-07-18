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
const modelDefDoc = ["Profile", "Link"];
const modelDefTitlePrefix = "model definition";
const modelDefDirectory = path.join(__dirname, `../packages/data-model`);
const modelDefStories = modelDefDoc
  // Generate the story navigation bar in the specified order
  .map((file) => ({
    titlePrefix: modelDefTitlePrefix,
    directory: `${modelDefDirectory}/stories`,
    files: `${file}.mdx`,
  }));

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
     * order : Introduction, React Hooks, Components, Examples, ...
     */
    return [
      // Introduction
      {
        ...story,
        directory: `${story.directory}/stories`,
        files: `**/Introduction.mdx`,
      },
      // React Hooks
      {
        ...story,
        directory: `${story.directory}/stories`,
        files: "**/hooks/**/*.{stories.@(js|jsx|ts|tsx),mdx}",
      },
      // Components
      {
        ...story,
        directory: `${story.directory}/src`,
        files: `**/*.{stories.@(js|jsx|ts|tsx),mdx}`,
      },
      // Examples
      {
        ...story,
        directory: `${story.directory}/stories`,
        files: `**/*.{stories.@(js|jsx|ts|tsx),mdx}`,
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
