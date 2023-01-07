import { Router, Routes } from './common/router';
import Details from './components/details/index';
import Cart from './components/cart/index';
import Main from './components/main';
import ErrorPage from './components/404/script404';
import Footer from './components/footer';
import Header from './components/header';
import './style.scss';

class Controller {
  public routes: Array<Routes>;
  public router: Router;

  constructor() {
    this.router = new Router('root');

    const header = new Header('header');
    header.inject('.header');
    new Footer('footer').inject('.footer');

    const mainComponent = new Main('main', this.router, header);
    const detailComponent = new Details('details');
    const errorComponent = new ErrorPage('page404');
    const cartComponent = new Cart('cart');

    this.routes = [
      new Routes(mainComponent, true),
      new Routes(detailComponent, false),
      new Routes(errorComponent, false),
      new Routes(cartComponent, false),
    ];

    this.router.initRoutes(this.routes);
  }
}

new Controller();
