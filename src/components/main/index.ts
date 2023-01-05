import Component from '../../common/component';
import { products } from '../../products';
import { IFilterAmount, IFilterProduct, IProduct } from '../../common/interface';
import Renderer from './renderer';
import './style.scss';
import { Router } from '../../common/router';
import Filter from './filter';

export default class Main extends Component {
  private renderer: Renderer;
  private filter: Filter;
  private router: Router;
  private data: Array<IProduct>;
  // private categoryData: Array<IFilterProduct>;
  // private brandData: Array<IFilterProduct>;

  constructor(name: string, router: Router) {
    super(name);
    this.data = products;
    // this.categoryData = [];
    // this.brandData = [];

    this.renderer = new Renderer();
    this.filter = new Filter(this.data);
    this.router = router;
  }

  public init(): void {
    this.handleData();
    this.renderer.init();
    this.renderer.render(this.data);
    this.renderer.renderFilterList('.scroll-filter_category', this.calcCategoryStock(this.data));
    this.renderer.renderFilterList('.scroll-filter_brand', this.calcBrandStock(this.data));
    this.renderer.renderFilterRangeValues(
      'from-price',
      'to-price',
      '.amount__start_price',
      '.amount__end_price',
      this.filter.getPriceRange()
    );
    localStorage.setItem('from-price', `${this.filter.getPriceRange().from}`);
    localStorage.setItem('to-price', `${this.filter.getPriceRange().to}`);
    this.renderer.renderFilterRangeValues(
      'from-stock',
      'to-stock',
      '.amount__start_num',
      '.amount__end_num',
      this.filter.getAmountRange()
    );
    localStorage.setItem('from-stock', `${this.filter.getAmountRange().from}`);
    localStorage.setItem('to-stock', `${this.filter.getAmountRange().to}`);
    this.initEvents();
    this.checkUrlLayout();
    this.filter.changeFoundAmount(this.data.length);
  }

  private handleData(): void {
    this.calcBrandStock(this.data);
    this.calcCategoryStock(this.data);
  }

  private initEvents(): void {
    this.handleProductClick();
    this.handlerProductLayout();
    this.handlePriceFilter();
    this.handleStockFilter();
    this.handleCopyUrl();
  }

  private calcCategoryStock(dataArr: Array<IProduct>): Array<IFilterProduct> {
    const result: { [n: string]: number } = {};

    for (let i = 0; i < dataArr.length; i++) {
      const stockAmount: number | undefined = result[dataArr[i].category];
      if (!stockAmount) result[dataArr[i].category] = dataArr[i].stock;
      else result[dataArr[i].category] += dataArr[i].stock;
    }

    const categoryData: Array<IFilterProduct> = Object.entries(result).map((i) => {
      return {
        name: i[0],
        stock: i[1],
      };
    });

    return categoryData;

    // this.categoryData = categoryData;
  }

  private calcBrandStock(dataArr: Array<IProduct>): Array<IFilterProduct> {
    const result: { [n: string]: number } = {};

    for (let i = 0; i < dataArr.length; i++) {
      const stockAmount: number | undefined = result[dataArr[i].brand];
      if (!stockAmount) result[dataArr[i].brand] = dataArr[i].stock;
      else result[dataArr[i].brand] += dataArr[i].stock;
    }

    const brandData: Array<IFilterProduct> = Object.entries(result).map((i) => {
      return {
        name: i[0],
        stock: i[1],
      };
    });

    return brandData;

    // this.brandData = brandData;
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
        this.filter.onChangePriceAmount(e, this.changeQueryParam.bind(this), this.renderNewData.bind(this))
      );
    }
  }

  private handleStockFilter() {
    const stockFilter = document.querySelector<HTMLDivElement>('.range-filter__control_stock');

    if (stockFilter) {
      stockFilter.addEventListener('change', (e) =>
        this.filter.onChangeStockAmount(e, this.changeQueryParam.bind(this), this.renderNewData.bind(this))
      );
    }
  }

  private handleCopyUrl(): void {
    const copyBtn = document.querySelector<HTMLDivElement>('.btn_copy');

    if (copyBtn) {
      copyBtn.addEventListener('click', this.filter.copyFilters);
    }
  }

  public renderNewData(newData: Array<IProduct>, newRangeData: IFilterAmount, indicator?: string) {
    this.renderer.render(newData);
    if (indicator) {
      this.renderer.renderFilterRangeValues(
        'from-stock',
        'to-stock',
        '.amount__start_num',
        '.amount__end_num',
        newRangeData
      );
    } else {
      this.renderer.renderFilterRangeValues(
        'from-price',
        'to-price',
        '.amount__start_price',
        '.amount__end_price',
        newRangeData
      );
    }

    const currBrandData = this.calcBrandStock(newData);
    const initBrandData = this.calcBrandStock(this.data);
    const currCategoryData = this.calcCategoryStock(newData);
    const initCategoryData = this.calcCategoryStock(this.data);

    this.renderer.renderFilterList('.scroll-filter_brand', currBrandData, initBrandData);
    this.renderer.renderFilterList('.scroll-filter_category', currCategoryData, initCategoryData);
  }

  private changeLayoutQueryParam(btnWrapper: HTMLDivElement): void {
    const collection: HTMLCollection = btnWrapper.children;
    const btnArr = Array.from(collection);
    const active = btnArr.find((btn) => btn.className.includes('layout__btn_active'));

    if (active && active.className.includes('layout__btn_row')) {
      this.router.appendParam('productLayout', 'row');
    } else {
      this.router.appendParam('productLayout', 'grid');
    }
  }

  public changeQueryParam(key: string, value: string): void {
    this.router.appendParam(key, value);
  }

  public checkUrlLayout(): void {
    const query = window.location.search;
    const regEx = /(?<==)(\w+)/gm;

    if (query.includes('productLayout=row')) {
      this.renderer.setRowProductLayout();
    }
    if (query.includes('productLayout=grid')) {
      this.renderer.setGridProductLayout();
    }
    if (query.includes('from-price')) {
      const param = query.indexOf('from-price');
      const str = query.slice(param);

      this.renderer.changeFilterRangeValues(
        'from-price',
        '.amount__start_price',
        this.filter.getPriceRange(),
        str.match(regEx)?.[0]
      );
    }
    if (query.includes('to-price')) {
      const param = query.indexOf('to-price');
      const str = query.slice(param);

      this.renderer.changeFilterRangeValues(
        'to-price',
        '.amount__end_price',
        this.filter.getPriceRange(),
        str.match(regEx)?.[0]
      );
    }
    if (query.includes('from-stock')) {
      const param = query.indexOf('from-stock');
      const str = query.slice(param);

      this.renderer.changeFilterRangeValues(
        'from-stock',
        '.amount__start_num',
        this.filter.getAmountRange(),
        str.match(regEx)?.[0]
      );
    }
    if (query.includes('to-stock')) {
      const param = query.indexOf('to-stock');
      const str = query.slice(param);

      this.renderer.changeFilterRangeValues(
        'to-stock',
        '.amount__end_num',
        this.filter.getAmountRange(),
        str.match(regEx)?.[0]
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
}
