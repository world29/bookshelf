const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";

const common = {
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "./",
    filename: "[name].js",
  },
  resolve: {
    modules: [path.resolve(__dirname, "node_modules")],
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: [/\.css/],
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: { url: false },
          },
        ],
      },
      {
        test: [/\.ts$/, /\.tsx$/],
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                [
                  "@babel/preset-react",
                  {
                    runtime: "automatic",
                  },
                ],
                "@babel/preset-typescript",
              ],
            },
          },
        ],
      },
    ],
  },
  watch: isDev,
  devtool: isDev ? "source-map" : undefined,
};

const main = {
  ...common,
  target: "electron-main",
  entry: {
    main: "./src/main/index.ts",
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: "src/static/package.json" }],
    }),
    new ESLintWebpackPlugin({
      extensions: ["ts", "tsx", "js"],
    }),
  ],
  externals: {
    sqlite3: "commonjs sqlite3",
    sharp: "commonjs sharp",
  },
};

const renderer = {
  ...common,
  target: "electron-renderer",
  entry: {
    renderer: "./src/renderer/index.tsx",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src/index.html"),
    }),
    new ESLintWebpackPlugin({
      extensions: ["ts", "tsx", "js"],
    }),
  ],
};

const worker = {
  ...common,
  target: "electron-renderer",
  entry: {
    worker: "./src/worker/index.ts",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src/worker.html"),
      filename: "worker.html",
    }),
    new ESLintWebpackPlugin({
      extensions: ["ts", "js"],
    }),
  ],
};

const preload = {
  ...common,
  target: "electron-preload",
  entry: {
    preload_renderer: "./src/renderer/preload.ts",
    preload_worker: "./src/worker/preload.ts",
  },
};

module.exports = [main, renderer, worker, preload];
