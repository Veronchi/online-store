import Component from '../../common/component';
import { products } from '../../products';
import { IFilterProduct, IProduct } from '../../common/interface';
import Renderer from './renderer';
import './style.scss';
import { Router } from '../../common/router';
import Filter from './filter';

export default class Main extends Component {
  private renderer: Renderer;
  private filter: Filter;
  private router: Router;
  private data: Array<IProduct>;
  private categoryData: Array<IFilterProduct>;
  private brandData: Array<IFilterProduct>;

  constructor(name: string, router: Router) {
    super(name);
    this.data = products;
    this.categoryData = [];
    this.brandData = [];
    this.renderer = new Renderer();
    this.filter = new Filter();
    this.router = router;
  }

  public init(): void {
    this.handleData();
    this.renderer.init();
    this.renderer.render(this.data);
    this.renderer.renderFilterList('.scroll-filter_category', this.categoryData);
    this.renderer.renderFilterList('.scroll-filter_brand', this.brandData);
    this.initEvents();
    this.checkUrlLayout();
  }

  private handleData(): void {
    this.calcBrandStock();
    this.calcCategoryStock();
  }

  private calcCategoryStock(): void {
    const result: { [n: string]: number } = {};

    for (let i = 0; i < this.data.length; i++) {
      const stockAmount: number | undefined = result[this.data[i].category];
      if (!stockAmount) result[this.data[i].category] = this.data[i].stock;
      else result[this.data[i].category] += this.data[i].stock;
    }

    const categoryData: Array<IFilterProduct> = Object.entries(result).map((i) => {
      return {
        name: i[0],
        stock: i[1],
      };
    });

    this.categoryData = categoryData;
  }

  private calcBrandStock(): void {
    const result: { [n: string]: number } = {};

    for (let i = 0; i < this.data.length; i++) {
      const stockAmount: number | undefined = result[this.data[i].brand];
      if (!stockAmount) result[this.data[i].brand] = this.data[i].stock;
      else result[this.data[i].brand] += this.data[i].stock;
    }

    const brandData: Array<IFilterProduct> = Object.entries(result).map((i) => {
      return {
        name: i[0],
        stock: i[1],
      };
    });

    this.brandData = brandData;
  }

  private initEvents(): void {
    this.handleProductClick();
    this.handlerProductLayout();
    this.handlePriceFilter();
    this.handleStockFilter();
  }

  private handleProductClick(): void {
    const productCatalog: HTMLElement | null = document.querySelector('.products__catalog');

    if (productCatalog) {
      productCatalog.addEventListener('click', (e) => this.selectProduct(e));
    }
  }

  private selectProduct(e: Event): void {
    const target = e.target as HTMLElement;
    const product = this.findNode(target);
    const productId = product?.id;

    localStorage.removeItem('productId');
    localStorage.setItem('productId', `${productId}`);
  }

  private findNode(el: HTMLElement): HTMLElement | undefined {
    let element = el;

    if (el.parentElement?.nodeName === 'LI') {
      return el.parentElement;
    } else {
      return (element = this.findNode(element.parentElement as HTMLElement) as HTMLElement);
    }
  }

  private handlerProductLayout(): void {
    const btnWrapper = document.querySelector<HTMLDivElement>('.layout');

    if (btnWrapper) {
      btnWrapper.addEventListener('click', (e) => {
        this.renderer.onChangeProductLayout(e);
        this.changeQueryParam(btnWrapper);
      });
    }
  }

  private changeQueryParam(btnWrapper: HTMLDivElement): void {
    const collection: HTMLCollection = btnWrapper.children;
    const btnArr = Array.from(collection);
    const active = btnArr.find((btn) => btn.className.includes('layout__btn_active'));

    if (active && active.className.includes('layout__btn_row')) {
      this.router.deleteParam('productLayout');
      this.router.appendParam('productLayout', 'row');
    } else {
      this.router.deleteParam('productLayout');
      this.router.appendParam('productLayout', 'grid');
    }
  }

  private handlePriceFilter(): void {
    const priceFilter = document.querySelector<HTMLDivElement>('.range-filter__control_price');

    if (priceFilter) {
      priceFilter.addEventListener('change', (e) => this.filter.onChangePriceAmount(e));
    }
  }

  private handleStockFilter() {
    const stockFilter = document.querySelector<HTMLDivElement>('.range-filter__control_stock');

    if (stockFilter) {
      stockFilter.addEventListener('change', (e) => this.filter.onChangeStockAmount(e));
    }
  }

  public checkUrlLayout(): void {
    const query = window.location.search;

    if (query === '?productLayout=row') {
      this.renderer.setRowProductLayout();
    } else if (query === '?productLayout=grid') {
      this.renderer.setGridProductLayout();
    }
  }
}
