import path from "path";
import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerDMG } from "@electron-forge/maker-dmg";
import { WebpackPlugin } from "@electron-forge/plugin-webpack";
import { mainConfig } from "./webpack.main.config";
import { rendererConfig } from "./webpack.renderer.config";

const config: ForgeConfig = {
  packagerConfig: {
    icon: path.join(process.cwd(), "icon", "icon.icns"),
    extraResource: [
      path.join(process.cwd(), "icon", "icon.icns"), // Add the ICNS file as an extra resource
    ],
  },
  rebuildConfig: {},
  makers: [
    new MakerDMG({
      icon: path.join(process.cwd(), "icon", "icon.icns"),
      format: "ULFO",
    }),
  ],
  plugins: [
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: "./src/index.html",
            js: "./src/renderer.ts",
            name: "main_window",
            preload: {
              js: "./src/preload.ts",
            },
          },
        ],
      },
    }),
  ],
};

export default config;
