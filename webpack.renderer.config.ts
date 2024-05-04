import type { Configuration } from "webpack";
import { rules } from "./webpack.rules";
import { plugins } from "./webpack.plugins";
import path from "path";

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  externals: {
    "./cptable": "var cptable",
  },
  target: "electron-renderer",
  plugins,
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css"],
    alias: {
      assets: path.resolve(__dirname, "src/assets/"),
      components: path.resolve(__dirname, "src/components/"),
      containers: path.resolve(__dirname, "src/containers/"),
      utils: path.resolve(__dirname, "src/utils/"),
      data: path.resolve(__dirname, "src/data/"),
      hooks: path.resolve(__dirname, "src/hooks/"),
      router: path.resolve(__dirname, "src/router/"),
      models: path.resolve(__dirname, "src/models/"),
      pages: path.resolve(__dirname, "src/pages/"),
      styles: path.resolve(__dirname, "src/styles/"),
      src: path.resolve(__dirname, "src/"),
    },
  },
};
