import * as fs from "fs";
import * as path from "path";
import * as webpack from "webpack";
// @ts-ignore
import PugPlugin from "pug-plugin";

const PAGES_DIR = path.resolve(__dirname, "src/pages");
const PAGES = fs
  .readdirSync(PAGES_DIR)
  .map((page) => page.replace(/\.[^/.]+$/, ""));
const PATHS = {
  src: path.resolve(__dirname, "src"),
  dist: path.resolve(__dirname, "dist"),
};
const isDevMode = process.env.NODE_ENV === "development";

const entryPages = PAGES.reduce<Record<string, string>>((pages, page) => {
  pages[page] = `${PAGES_DIR}/${page}/${page}.pug`;
  return pages;
}, {});

const filename = (ext: string) =>
  isDevMode ? `${ext}/[name].${ext}` : `${ext}/[name].[contenthash].${ext}`;

const config: webpack.Configuration = {
  mode: isDevMode ? "development" : "production",
  entry: entryPages,
  output: {
    path: PATHS.dist,
    filename: filename("js"),
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        include: PATHS.src,
        use: PugPlugin.loader,
      },
      {
        test: /\.scss$/,
        include: PATHS.src,
        use: ["css-loader", "postcss-loader", "sass-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new PugPlugin({
      clean: isDevMode,
      js: {
        filename: filename("js"),
      },
      css: {
        filename: filename("css"),
      },
    }),
    // new HtmlPlugin({ template: 'src/index.pug' }),
    // new HtmlPlugin({ filename: 'colors.html', template: 'src/pages/colors/colors.pug' }),
    // new HtmlPlugin({ filename: 'landing.html', template: 'src/pages/landing/landing.pug' }),
    // new MiniCSSExtractPlugin({
    //   filename: "[name].[contenthash].css",
    // }),
  ],
  resolve: {
    alias: {
      // pages: `path.resolve(__dirname, "src/pages/")`,
      layouts: path.resolve(__dirname, "src/layouts/"),
      pages: path.resolve(__dirname, "src/pages/"),
      styles: path.resolve(__dirname, "src/styles/"),
      assets: path.resolve(__dirname, "src/assets/"),
      components: path.resolve(__dirname, "src/components/"),
    },
  },
};

export default config;
