const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
  const mode = argv && argv.mode ? argv.mode : 'development';
  const isProd = mode === 'production';

  return {
    mode,
    entry: {
      main: './app/index',
    },
    output: {
      path: path.join(__dirname, 'dist'),
      clean: true,
      filename: isProd ? '[name].[contenthash:8].js' : '[name].js',
      chunkFilename: isProd ? '[name].[contenthash:8].js' : '[name].js',
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
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            {
              loader: 'css-loader',
              options: {
                url: false,
              },
            },
            'sass-loader',
          ],
        },
        {
          test: /\.(png|woff|woff2|eot|ttf|svg)$/,
          use: { loader: 'url-loader?limit=100000' },
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
    devtool: isProd ? 'source-map' : 'eval-source-map',
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          { from: 'static', to: 'static' },
          { from: 'favicon.ico', to: 'favicon.ico' },
        ],
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'static', 'index.html'),
        filename: 'index.html',
      }),
      ...(isProd
        ? [
            new MiniCssExtractPlugin({
              filename: '[name].[contenthash:8].css',
              chunkFilename: '[id].[contenthash:8].css',
            }),
          ]
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
            name: 'vendor',
            chunks: 'initial',
          },
        },
      },
      runtimeChunk: isProd ? 'single' : false,
    },
  };
};
