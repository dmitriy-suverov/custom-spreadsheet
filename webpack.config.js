const { join, resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

function optimization() {
  const config = {
    splitChunks: {
      chunks: "all"
    }
  };

  if (!isDev) {
    config.minimizer = [new TerserPlugin(), new OptimizeCSSAssetsPlugin()];
  }
  return config;
}

function jsLoaders() {
  const loaders = [
    {
      loader: "babel-loader",
      options: {
        presets: ["@babel/preset-env"],
        plugins: ["@babel/plugin-proposal-class-properties"]
      }
    }
  ];

  if (!isDev) {
    loaders.push("eslint-loader");
  }
  return loaders;
}

module.exports = {
  context: resolve(__dirname, "src"),
  mode: process.env.NODE_ENV,
  entry: ["@babel/polyfill", "./index.ts"],
  output: {
    path: resolve(__dirname, "dist"),
    filename: "bundle_[hash].js"
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      "~": resolve(__dirname, "src"),
      "~/core": resolve(__dirname, "src/core")
    }
  },
  devtool: isDev ? "source-map" : false,
  devServer: {
    port: 4200,
    hot: isDev
  },
  // optimization: optimization(),
  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: jsLoaders()
      },
      {
        test: /\.ts$/i,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          isDev
            ? "style-loader"
            : {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  hmr: isDev,
                  reloadAll: true
                }
              },
          "css-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.html$/i,
        loader: "html-loader"
      },
      {
        test: /\.(png|jpg|svg|git)$/i,
        use: ["file-loader"]
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/i,
        use: ["file-loader"]
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
      minify: {
        collapseWhitespace: isProd,
        removeComments: isProd
      }
    }),
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false
    }),
    new CopyWebpackPlugin(
      [
        {
          from: resolve(__dirname, "src/favicon.ico"),
          to: resolve(__dirname, "dist ")
        }
      ],
      {
        ignore: ["*.ts"]
      }
    ),
    new MiniCssExtractPlugin({
      filename: "[hash]_styles.css"
    })
  ]
};
