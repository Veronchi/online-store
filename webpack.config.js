import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { fileURLToPath } from 'url';
import { CleanWebpackPlugin } from 'clean-webpack-plugin'; //для очистки dist

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: 'development',
  entry: {
    main: './src/script.ts',
    page404: './src/pages/page-404/script-404.ts', //разделил вход для скриптов
    details: './src/pages/details/script-details.ts',
  },
  output: {
    filename: './[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
    hot: false,
    liveReload: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/pages/main/index.html',
      inject: 'body',
      minify: false,
    }),
    new HtmlWebpackPlugin({ //страница 404 html
      filename: 'page-404.html',
      template: './src/pages/page-404/page-404.html',
      inject: 'body',
      minify: false,
    }),
    new HtmlWebpackPlugin({ //страница details html
      filename: 'details.html',
      template: './src/pages/details/details.html',
      inject: 'body',
      minify: false,
    }),
    new CleanWebpackPlugin(), //очистка dist
  ],
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.(sa|sc|c)ss$/i,
        use: ['style-loader', 'css-loader', 'resolve-url-loader', 'sass-loader'],
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: './images/[hash][ext][query]',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
};
