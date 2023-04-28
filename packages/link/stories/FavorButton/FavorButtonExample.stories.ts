import type { Meta, StoryObj } from "@storybook/react";

import { FavorButtonExample as FavorButtonImportCssComponent } from "./FavorButtonImportCss";
import { FavorButtonExample as FavorButtonCssModuleComponent } from "./FavorButtonCssModule";
import { FavorButtonExample as FavorButtonStyledComponent } from "./FavorButtonStyled";

import codeImportCss from "!!raw-loader!./FavorButtonImportCss";
import codeImportCssStyle from "!!raw-loader!./FavorButton.css";

import codeCssModule from "!!raw-loader!./FavorButtonCssModule";
import codeCssModuleStyle from "!!raw-loader!./FavorButton.module.css";

import codeStyled from "!!raw-loader!./FavorButtonStyled";

// import css
export const metaImportCss = {
  title: "Examples/FavorButtonImportCss",
  component: FavorButtonImportCssComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof FavorButtonImportCssComponent>;

type StoryImportCss = StoryObj<typeof FavorButtonImportCssComponent>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const FavorButtonImportCss: StoryImportCss = {
  parameters: {
    docs: {
      source: {
        code: [
          `\n \n  // ======== FavorButtonExample.css ======== \n \n`,
          codeImportCssStyle,
          `\n \n // ======== FavorButtonExample.tsx ======== \n \n`,
          codeImportCss,
        ],
      },
      canvas: { sourceState: "shown" },
    },
  },
};

// css module
export const metaCssModule = {
  title: "Examples/FavorButtonCssModule",
  component: FavorButtonCssModuleComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof FavorButtonCssModuleComponent>;

type StoryCssModule = StoryObj<typeof FavorButtonCssModuleComponent>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const FavorButtonCssModule: StoryCssModule = {
  parameters: {
    docs: {
      source: {
        code: [
          `\n \n  // ======== FavorButtonExample.css ======== \n \n`,
          codeCssModuleStyle,
          `\n \n // ======== FavorButtonExample.tsx ======== \n \n`,
          codeCssModule,
        ],
      },
      canvas: { sourceState: "shown" },
    },
  },
};

// styled
const metaStyled = {
  title: "Examples/FavorButtonStyled",
  component: FavorButtonStyledComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof FavorButtonStyledComponent>;
export default metaStyled;

type Story = StoryObj<typeof FavorButtonStyledComponent>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const FavorButtonStyled: Story = {
  parameters: {
    docs: {
      source: {
        code: codeStyled,
      },
      canvas: { sourceState: "shown" },
    },
  },
};
