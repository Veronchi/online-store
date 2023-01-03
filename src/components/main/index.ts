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
    this.filter = new Filter(this.data);
    this.router = router;
  }

  public init(): void {
    this.handleData();
    this.renderer.init();
    this.renderer.render(this.data);
    this.renderer.renderFilterList('.scroll-filter_category', this.categoryData);
    this.renderer.renderFilterList('.scroll-filter_brand', this.brandData);
    this.renderer.renderFilterRangeValues(
      'from-price',
      'to-price',
      '.amount__start_price',
      '.amount__end_price',
      this.filter.getPriceRange()
    );
    this.renderer.renderFilterRangeValues(
      'from-stock',
      'to-stock',
      '.amount__start_num',
      '.amount__end_num',
      this.filter.getAmountRange()
    );
    this.initEvents();
    this.checkUrlLayout();
  }

  private handleData(): void {
    this.calcBrandStock();
    this.calcCategoryStock();
  }

  private initEvents(): void {
    this.handleProductClick();
    this.handlerProductLayout();
    this.handlePriceFilter();
    this.handleStockFilter();
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

  private handleProductClick(): void {
    const productCatalog: HTMLElement | null = document.querySelector('.products__catalog');

    if (productCatalog) {
      productCatalog.addEventListener('click', (e) => this.selectProduct(e));
    }
  }

  private handlerProductLayout(): void {
    const btnWrapper = document.querySelector<HTMLDivElement>('.layout');

    if (btnWrapper) {
      btnWrapper.addEventListener('click', (e) => {
        this.renderer.onChangeProductLayout(e);
        this.changeLayoutQueryParam(btnWrapper);
      });
    }
  }

  private handlePriceFilter(): void {
    const priceFilter = document.querySelector<HTMLDivElement>('.range-filter__control_price');

    if (priceFilter) {
      priceFilter.addEventListener('change', (e) =>
        this.filter.onChangePriceAmount(e, this.changeQueryParam.bind(this))
      );
    }
  }

  private handleStockFilter() {
    const stockFilter = document.querySelector<HTMLDivElement>('.range-filter__control_stock');

    if (stockFilter) {
      stockFilter.addEventListener('change', (e) =>
        this.filter.onChangeStockAmount(e, this.changeQueryParam.bind(this))
      );
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

  private changeLayoutQueryParam(btnWrapper: HTMLDivElement): void {
    const collection: HTMLCollection = btnWrapper.children;
    const btnArr = Array.from(collection);
    const active = btnArr.find((btn) => btn.className.includes('layout__btn_active'));

    if (active && active.className.includes('layout__btn_row')) {
      this.router.appendParam('productLayout', 'row', 'productLayout', 'grid');
    } else {
      this.router.appendParam('productLayout', 'grid', 'productLayout', 'row');
    }
  }

  public changeQueryParam(key: string, value: string): void {
    this.router.appendParam(key, value);
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
