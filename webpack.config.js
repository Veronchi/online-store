import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { fileURLToPath } from 'url';
import { CleanWebpackPlugin } from 'clean-webpack-plugin'; //для очистки dist

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: 'development',
  entry: './src/script.ts',
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
      template: './src/index.html',
      inject: 'body',
      minify: false,
    }),
    new HtmlWebpackPlugin({
      filename: 'details.html',
      template: './src/components/details/index.html',
      inject: false,
    }),
    new HtmlWebpackPlugin({
      filename: 'main.html',
      template: './src/components/main/index.html',
      inject: false,
    }),
    new HtmlWebpackPlugin({
      filename: 'header.html',
      template: './src/components/header/index.html',
      inject: false,
    }),
    new HtmlWebpackPlugin({
      filename: 'footer.html',
      template: './src/components/footer/index.html',
      inject: false,
    }),
    new HtmlWebpackPlugin({
      filename: 'page404.html',
      template: './src/components/404/page404.html',
      inject: false,
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
