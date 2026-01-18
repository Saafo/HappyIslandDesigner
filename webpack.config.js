const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: {
    main: './app/index',
  },
  output: {
    path: path.join(__dirname),
    filename: (pathData) => (pathData.chunk && pathData.chunk.name === 'main' ? 'bundle.js' : '[name].bundle.js'),
    chunkFilename: '[name].bundle.js',
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          process.env.NODE_ENV !== 'production'
            ? 'style-loader'
            : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        use: { loader: 'url-loader?limit=100000', },
      },
      {
        test: /\.(j|t)s(x)?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: { browsers: 'last 2 versions' },
                  useBuiltIns: 'entry',
                  corejs: '3',
                },
              ],
              '@babel/preset-typescript',
              '@babel/react',
            ],
            plugins: [
              ['@babel/plugin-proposal-class-properties', { loose: true }],
              [
                '@babel/plugin-transform-runtime',
                {
                  regenerator: true,
                },
              ],
              ['babel-plugin-typescript-to-proptypes', {}],
            ],
          },
        },
      },
    ],
  },
  ignoreWarnings: [
    (warning) => {
      const message = warning && typeof warning.message === 'string' ? warning.message : '';
      return message.includes("Should not import the named export 'version' (imported as 'version') from default-exporting module");
    },
  ],
  devtool: 'eval-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'static', 'index.html'),
      filename: 'index.html',
    }),
    ...(process.env.NODE_ENV === 'production'
      ? [
          new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
          }),
        ]
      : []),
    ...(process.env.NODE_ENV === 'production'
      ? []
      : [
          new webpack.HotModuleReplacementPlugin(),
        ]),
  ],
  devServer: {
    static: {
      directory: __dirname,
    },
    port: 8080,
    hot: true,
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "initial",
        }
      }
    }
  }
};
