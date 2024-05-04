import type { Configuration } from "webpack";

import { rules } from "./webpack.rules";

export const mainConfig: Configuration = {
  entry: "./src/main.ts",
  module: {
    rules,
  },
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".json"],
    fallback: {
      fs: require.resolve("fs"),
      path: require.resolve("path"),
      zlib: require.resolve("zlib"),
      http: require.resolve("http"),
      https: require.resolve("https"),
      url: require.resolve("url"),
    },
  },
};
