﻿const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");

const common = {
  mode: "development",
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
        test: [/\.ts$/, /\.tsx$/],
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                "@babel/preset-react",
                "@babel/preset-typescript",
              ],
            },
          },
        ],
      },
    ],
  },
};

const main = {
  ...common,
  target: "electron-main",
  entry: {
    main: "./src/main/index.ts",
  },
  plugins: [
    new ESLintWebpackPlugin({
      extensions: ["ts", "tsx", "js"],
    }),
  ],
};

const renderer = {
  ...common,
  target: "electron-renderer",
  entry: {
    renderer: "./src/app.tsx",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src/index.html"),
    }),
    new ESLintWebpackPlugin({
      extensions: ["ts", "tsx", "js"],
    }),
  ],
  devServer: {
    static: path.resolve(__dirname, "dist"),
  },
};

const preload = {
  ...common,
  target: "electron-preload",
  entry: {
    preload: "./src/preload.ts",
  },
};

module.exports = [main, renderer, preload];
