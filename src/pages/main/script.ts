import { products } from '../../products';
import Filter from './filter';
import { IProduct, IRenderProps } from './interface';
import RendererProducts from './renderer';
import RouterProducts from './routerProducts';

class Controller {
  private renderer: RendererProducts;
  private filter: Filter;
  // private router: Router;
  private routerProducts: RouterProducts;
  private data: Array<IProduct>;

  constructor({ rootElement }: IRenderProps) {
    this.data = [];
    this.renderer = new RendererProducts(rootElement);
    this.filter = new Filter();
    this.routerProducts = new RouterProducts();
    this.initEvents();
    this.initialize();
  }

  private initialize() {
    this.routerProducts.getParseQueryParam();
  }

  public fetchData(): void {
    this.data = products;
  }

  public getData(): Array<IProduct> {
    return this.data;
  }

  public draw(): void {
    this.renderer.render(this.data);
  }

  private initEvents() {
    this.handlerProductLayout();
  }

  private handlerProductLayout() {
    const btnWrapper = document.querySelector<HTMLDivElement>('.layout');

    if (btnWrapper) {
      btnWrapper.addEventListener('click', (e) => {
        this.renderer.onChangeProductLayout(e);
        // this.routerProducts.onChangeProductLayout(btnWrapper);
      });
    }
  }
}

const controller = new Controller({
  rootElement: '.products__catalog',
});
controller.fetchData();
controller.draw();
