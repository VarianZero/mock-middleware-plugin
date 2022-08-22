const HtmlWebpackPlugin = require("html-webpack-plugin");
const mockMiddlewarePlugin = require("mock-middleware-plugin");
const bodyParser = require("body-parser");
const path = require("path");
let mockport = 9011;

module.exports = () => {
  return {
    mode: "development",
    entry: {
      vendors: ["react", "react-dom"],
      app: "./index.jsx",
    },
    output: {
      path: path.resolve(__dirname, "../dist"),
      filename: "[name].js",
      chunkFilename: "[name].[chunkhash].js",
      crossOriginLoading: "anonymous",
      assetModuleFilename: "files/[hash][ext][query]",
      clean: true,
    },
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx", ".less", ".scss", ".css"],
    },
    module: {
      rules: [
        {
          test: /\.m?jsx?$/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
          exclude: /node_modules/,
        },
      ],
    },
    devServer: {
      port: mockport,
      setupMiddlewares: (middlewares, devServer) => {
        if (!devServer) {
          throw new Error("webpack-dev-server is not defined");
        }
        middlewares.push(bodyParser.json());
        middlewares.push(bodyParser.urlencoded({ extended: true }));
        middlewares.push(
          mockMiddlewarePlugin(path.resolve(process.cwd(), "./mock"))
        );
        return middlewares;
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(process.cwd(), "./", "index.html"),
      }),
    ],
  };
};
