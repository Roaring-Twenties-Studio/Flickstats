import type { ModuleOptions } from "webpack";

export const rules: Required<ModuleOptions>["rules"] = [
  // Add support for native node modules
  {
    // We're specifying native_modules in the test because the asset relocator loader generates a
    // "fake" .node file which is really a cjs file.
    test: /native_modules[/\\].+\.node$/,
    use: "node-loader",
  },
  {
    test: /[/\\]node_modules[/\\].+\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: "@vercel/webpack-asset-relocator-loader",
      options: {
        outputAssetBase: "native_modules",
      },
    },
  },
  {
    test: /\.(ts|js)x?$/,
    exclude: /node_modules/,
    use: { loader: "swc-loader" },
  },
  { test: /\.css$/, use: ["style-loader", "css-loader"] },
  {
    test: /\.(png|jpg|jpeg|woff2)$/,
    use: ["file-loader"],
  },
  {
    test: /\.svg$/i,
    use: ["@svgr/webpack"],
  },
];
