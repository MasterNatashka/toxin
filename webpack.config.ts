import * as path from 'path';
import * as webpack from 'webpack';
import HtmlPlugin from 'html-webpack-plugin';
import MiniCSSExtractPlugin from 'mini-css-extract-plugin';
// @ts-ignore
import PugPlugin from 'pug-plugin';

const config: webpack.Configuration = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.[hash].js',
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        include: path.resolve(__dirname, 'src'),
        use: PugPlugin.loader,
      },
      {
        test: /\.scss$/,
        include: path.resolve(__dirname, 'src'),
        use: [MiniCSSExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new HtmlPlugin({ template: 'src/index.pug' }),
    new HtmlPlugin({ filename: 'landing.html', template: 'src/pages/landing/landing.pug' }),
    new MiniCSSExtractPlugin({
      filename: '[name].[hash].css',
    }),
  ],
  resolve: {
    alias: {
      pages: path.resolve(__dirname, 'src/pages/'),
      styles: path.resolve(__dirname, 'src/styles/'),
      components: path.resolve(__dirname, 'src/components/'),
    },
  },
};

export default config;
