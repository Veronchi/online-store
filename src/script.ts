import { Router, Routes } from './common/router';
import Details from './components/details';
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

    new Header('header').inject('.header');
    new Footer('footer').inject('.footer');

    const mainComponent = new Main('main', this.router);
    const detailComponent = new Details('details');
    const errorComponent = new ErrorPage('page404');

    this.routes = [
      new Routes(mainComponent, true),
      new Routes(detailComponent, false),
      new Routes(errorComponent, false),
    ];

    this.router.initRoutes(this.routes);
  }
}

new Controller();
