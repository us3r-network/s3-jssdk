import type { Meta, StoryObj } from "@storybook/react";

import { LoginButtonExample as LoginButtonImportCssComponent } from "./LoginButtonImportCss";
import { LoginButtonExample as LoginButtonCssModuleComponent } from "./LoginButtonCssModule";
import { LoginButtonExample as LoginButtonStyledComponent } from "./LoginButtonStyled";

import codeImportCss from "!!raw-loader!./LoginButtonImportCss";
import codeImportCssStyle from "!!raw-loader!./LoginButton.css";

import codeCssModule from "!!raw-loader!./LoginButtonCssModule";
import codeCssModuleStyle from "!!raw-loader!./LoginButton.module.css";

import codeStyled from "!!raw-loader!./LoginButtonStyled";

// import css
export const metaImportCss = {
  title: "Examples/LoginButtonImportCss",
  component: LoginButtonImportCssComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof LoginButtonImportCssComponent>;

type StoryImportCss = StoryObj<typeof LoginButtonImportCssComponent>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const LoginButtonImportCss: StoryImportCss = {
  parameters: {
    docs: {
      source: {
        code: [
          `\n \n  // ======== LoginButtonExample.css ======== \n \n`,
          codeImportCssStyle,
          `\n \n // ======== LoginButtonExample.tsx ======== \n \n`,
          codeImportCss,
        ],
      },
      canvas: { sourceState: "shown" },
    },
  },
};

// css module
export const metaCssModule = {
  title: "Examples/LoginButtonCssModule",
  component: LoginButtonCssModuleComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof LoginButtonCssModuleComponent>;

type StoryCssModule = StoryObj<typeof LoginButtonCssModuleComponent>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const LoginButtonCssModule: StoryCssModule = {
  parameters: {
    docs: {
      source: {
        code: [
          `\n \n  // ======== LoginButtonExample.css ======== \n \n`,
          codeCssModuleStyle,
          `\n \n // ======== LoginButtonExample.tsx ======== \n \n`,
          codeCssModule,
        ],
      },
      canvas: { sourceState: "shown" },
    },
  },
};

// styled
const metaStyled = {
  title: "Examples/LoginButtonStyled",
  component: LoginButtonStyledComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof LoginButtonStyledComponent>;
export default metaStyled;

type Story = StoryObj<typeof LoginButtonStyledComponent>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const LoginButtonStyled: Story = {
  parameters: {
    docs: {
      source: {
        code: codeStyled,
      },
      canvas: { sourceState: "shown" },
    },
  },
};
