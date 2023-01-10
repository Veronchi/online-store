import Component from '../../common/component';
import { products } from '../../products';
import { Ibasket, IFilterAmount, IFilterProduct, IProduct, TQParams } from '../../common/interface';
import Renderer from './renderer';
import './style.scss';
import { Router } from '../../common/router';
import Filter from './filter';
import FilterRenderer from './filterRender';
import Details from '../details';

export default class Main extends Component {
  private renderer: Renderer;
  private filter: Filter;
  private filterRenderer: FilterRenderer;
  private router: Router;
  private data: Array<IProduct>;
  private details: Details;
  private basketData: Ibasket;

  constructor(name: string, router: Router, details: Details) {
    super(name);
    this.data = products;
    this.renderer = new Renderer();
    this.details = details;
    this.filter = new Filter(this.data);
    this.filterRenderer = new FilterRenderer({
      lists: [{ root: '.scroll-filter_category' }, { root: '.scroll-filter_brand' }],
      ranges: [{ root: '.range-filter_price' }, { root: '.range-filter_stock' }],
    });
    this.router = router;
    this.basketData = JSON.parse(localStorage.getItem('basket') as string);
  }

  public init(): void {
    this.handleData();
    this.renderer.init();
    this.renderer.render(this.data);
    this.details.initFromMain();
    this.details.drawCart();
    this.filterRenderer.init();
    this.filterRenderer.renderFilterList('.scroll-filter_category', this.calcCategoryStock(this.data));
    this.filterRenderer.renderFilterList('.scroll-filter_brand', this.calcBrandStock(this.data));
    this.filterRenderer.renderFilterRangeValues('.range-filter_price', this.filter.getPriceRange());
    localStorage.setItem('from-price', `${this.filter.getPriceRange().from}`);
    localStorage.setItem('to-price', `${this.filter.getPriceRange().to}`);
    this.filterRenderer.renderFilterRangeValues('.range-filter_stock', this.filter.getAmountRange());
    localStorage.setItem('from-stock', `${this.filter.getAmountRange().from}`);
    localStorage.setItem('to-stock', `${this.filter.getAmountRange().to}`);
    this.initEvents();
    this.checkUrlLayout();
    this.filter.changeFoundAmount(this.data.length);
    // const basketData = JSON.parse(localStorage.getItem('basket') as string);
    const nodes = this.findItem(this.basketData);
    this.basketData ? this.renderer.changeProductBtn(nodes) : null;
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
    this.handleCategoryFilter();
    this.handleCopyUrl();
    this.handleBrandList();
    this.handleCategoryList();
    this.handleSearchInput();
    this.handleDropdownList();
    this.handleClearFilters();
  }

  private handleDropdownList(): void {
    const dropdown: HTMLElement | null = document.querySelector('.dropdown');
    const dropdownLabel: HTMLElement | null = document.querySelector('.dropdown__label');
    const dropdownList: HTMLElement | null = document.querySelector('.dropdown .dropdown__list');

    if (dropdown && dropdownList) {
      dropdown.addEventListener('click', (e) => {
        const dropdownEl = <HTMLInputElement>e.target;
        if (dropdownEl.classList.contains('dropdown') || dropdownEl.classList.contains('dropdown__label')) {
          dropdownList.style.display = dropdownList.style.display === 'block' ? 'none' : 'block';
        } else if (dropdownEl.classList.contains('dropdown__item')) {
          dropdownList.style.display = dropdownList.style.display === 'block' ? 'none' : 'block';
          const sortID: string = dropdownEl.dataset.sortid || '';
          this.filter.addSortParam(sortID);
          this.filter.filter();
          const renderedData = this.filter.getFilteredData();
          if (dropdownLabel) dropdownLabel.innerText = dropdownEl.innerText;
          this.router.appendParam('sortBy', `${sortID}`);
          this.renderer.render(renderedData);
          const nodes = this.findItem(this.basketData);
          this.basketData ? this.renderer.changeProductBtn(nodes) : null;
        }
      });
    }
  }

  private handleBrandList(): void {
    const brandList: HTMLElement | null = document.querySelector('.scroll-filter_brand');

    if (brandList) {
      brandList.addEventListener('click', (e) => {
        if ((<Element>e.target).tagName === 'INPUT') {
          const inputElem = <HTMLInputElement>e.target;
          inputElem.checked
            ? this.filter.addFilterBrand(inputElem.name)
            : this.filter.removeFilterBrand(inputElem.name);
          if (inputElem.checked) this.router.addParam('brandList', `${inputElem.name}`);
          else this.router.removeParam('brandList', `${inputElem.name}`);
          this.filter.filter();
          const renderedData = this.filter.getFilteredData();
          this.filterRenderer.renderFilterRangeValues('.range-filter_price', this.filter.getPriceRange());
          this.filterRenderer.renderFilterRangeValues('.range-filter_stock', this.filter.getAmountRange());
          // this.filterRenderer.renderFilterList('.scroll-filter_category', this.calcCategoryStock(renderedData));
          // this.filterRenderer.renderFilterList('.scroll-filter_brand', this.calcBrandStock(renderedData));
          this.renderer.render(renderedData);
          const nodes = this.findItem(this.basketData);
          this.basketData ? this.renderer.changeProductBtn(nodes) : null;
        }
      });
    }
  }

  private handleCategoryList(): void {
    const categoryList: HTMLElement | null = document.querySelector('.scroll-filter_category');

    if (categoryList) {
      categoryList.addEventListener('click', (e) => {
        if ((<Element>e.target).tagName === 'INPUT') {
          const inputElem = <HTMLInputElement>e.target;
          inputElem.checked
            ? this.filter.addFilterCatergory(inputElem.name)
            : this.filter.removeFilterCatergory(inputElem.name);
          if (inputElem.checked) this.router.addParam('categoryList', `${inputElem.name}`);
          else this.router.removeParam('categoryList', `${inputElem.name}`);
          this.filter.filter();
          const renderedData = this.filter.getFilteredData();
          this.filterRenderer.renderFilterRangeValues('.range-filter_price', this.filter.getPriceRange());
          this.filterRenderer.renderFilterRangeValues('.range-filter_stock', this.filter.getAmountRange());
          // this.filterRenderer.renderFilterList('.scroll-filter_category', this.calcCategoryStock(renderedData));
          // this.filterRenderer.renderFilterList('.scroll-filter_brand', this.calcBrandStock(renderedData));
          this.renderer.render(renderedData);
          const nodes = this.findItem(this.basketData);
          this.basketData ? this.renderer.changeProductBtn(nodes) : null;
        }
      });
    }
  }

  private handleSearchInput(): void {
    const searchInput: HTMLElement | null = document.querySelector('.search__input');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const searchInput = <HTMLInputElement>e.target;
        const value = searchInput.value;
        this.filter.addSearchParam(value);
        this.filter.filter();
        const filteredData = this.filter.getFilteredData();
        this.filterRenderer.renderFilterList('.scroll-filter_category', this.calcCategoryStock(filteredData));
        this.filterRenderer.renderFilterList('.scroll-filter_brand', this.calcBrandStock(filteredData));
        this.router.appendParam('searchQuery', `${this.filter.getSearchQuery()}`);
        this.renderer.render(filteredData);
        const nodes = this.findItem(this.basketData);
        this.basketData ? this.renderer.changeProductBtn(nodes) : null;
      });
    }
  }

  private calcCategoryStock(dataArr: Array<IProduct>): Array<IFilterProduct> {
    let result: { [n: string]: number } = {};
    const z: { [n: string]: number } = {};
    const y: { [n: string]: number } = {};

    for (let i = 0; i < dataArr.length; i++) {
      const stockAmount: number | undefined = result[dataArr[i].category];
      if (!stockAmount) result[dataArr[i].category] = 1;
      else result[dataArr[i].category] += 1;
    }

    for (let i = 0; i < this.data.length; i++) {
      const stockAmount: number | undefined = z[this.data[i].category];
      if (!stockAmount) z[this.data[i].category] = 0;
      else z[this.data[i].category] = 0;
    }

    for (let i = 0; i < this.filter.dataToList.length; i++) {
      const stockAmount: number | undefined = y[this.filter.dataToList[i].category];
      if (!stockAmount) y[this.filter.dataToList[i].category] = 1;
      else y[this.filter.dataToList[i].category] += 1;
    }

    result = Object.assign({}, z, result, y);
    const categoryData: Array<IFilterProduct> = Object.entries(result).map((i) => {
      return {
        name: i[0],
        stock: i[1],
        checked: this.filter.categoryData.includes(i[0]),
      };
    });
    return categoryData;
  }

  private calcBrandStock(dataArr: Array<IProduct>): Array<IFilterProduct> {
    let result: { [n: string]: number } = {};
    const z: { [n: string]: number } = {};
    const y: { [n: string]: number } = {};

    for (let i = 0; i < dataArr.length; i++) {
      const stockAmount: number | undefined = result[dataArr[i].brand];
      if (!stockAmount) result[dataArr[i].brand] = 1;
      else result[dataArr[i].brand] += 1;
    }

    for (let i = 0; i < this.data.length; i++) {
      const stockAmount: number | undefined = z[this.data[i].brand];
      if (!stockAmount) z[this.data[i].brand] = 0;
      else z[this.data[i].brand] = 0;
    }

    for (let i = 0; i < this.filter.dataToList.length; i++) {
      const stockAmount: number | undefined = y[this.filter.dataToList[i].brand];
      if (!stockAmount) y[this.filter.dataToList[i].brand] = 1;
      else y[this.filter.dataToList[i].brand] += 1;
    }

    result = Object.assign({}, z, result, y);
    const brandData: Array<IFilterProduct> = Object.entries(result).map((i) => {
      return {
        name: i[0],
        stock: i[1],
        checked: this.filter.brandData.includes(i[0]),
      };
    });

    return brandData;
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
      priceFilter.addEventListener('change', (e) => {
        this.filter.filter();
        const filteredData = this.filter.getFilteredData();
        this.filterRenderer.renderFilterList('.scroll-filter_category', this.calcCategoryStock(filteredData));
        this.filterRenderer.renderFilterList('.scroll-filter_brand', this.calcBrandStock(filteredData));
        this.renderer.render(filteredData);

        this.router.appendParam('from-price', `${this.filter.getPriceRange().from}`);
        this.router.appendParam('to-price', `${this.filter.getPriceRange().to}`);
        const nodes = this.findItem(this.basketData);
        this.basketData ? this.renderer.changeProductBtn(nodes) : null;
        // localStorage.setItem('from-price', `${this.filter.getPriceRange().from}`);
        // localStorage.setItem('to-price', `${this.filter.getPriceRange().to}`);
      });
    }
  }

  private handleStockFilter(): void {
    const stockFilter = document.querySelector<HTMLDivElement>('.range-filter__control_stock');

    if (stockFilter) {
      stockFilter.addEventListener('change', (e) => {
        this.filter.filter();
        const filteredData = this.filter.getFilteredData();
        this.filterRenderer.renderFilterList('.scroll-filter_category', this.calcCategoryStock(filteredData));
        this.filterRenderer.renderFilterList('.scroll-filter_brand', this.calcBrandStock(filteredData));
        this.renderer.render(filteredData);

        this.router.appendParam('from-stock', `${this.filter.getAmountRange().from}`);
        this.router.appendParam('to-stock', `${this.filter.getAmountRange().to}`);
        const nodes = this.findItem(this.basketData);
        this.basketData ? this.renderer.changeProductBtn(nodes) : null;
        // localStorage.setItem('from-stock', `${this.filter.getAmountRange().from}`);
        // localStorage.setItem('to-stock', `${this.filter.getAmountRange().to}`);
      });
    }
  }

  private handleCopyUrl(): void {
    const copyBtn = document.querySelector<HTMLButtonElement>('.btn_copy');

    if (copyBtn) {
      copyBtn.addEventListener('click', this.filter.copyFilters);
    }
  }

  private handleClearFilters() {
    const clearBtn = document.querySelector<HTMLButtonElement>('.btn_reset');

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.renderer.render(this.data);
        this.filter.calcInitPriceRange(this.data);
        this.filter.calcInitAmountRange(this.data);
        this.filterRenderer.renderFilterRangeValues('.range-filter_price', this.filter.getPriceRange());
        this.filterRenderer.renderFilterRangeValues('.range-filter_stock', this.filter.getAmountRange());
        this.filter.changeFoundAmount(this.data.length);
        const nodes = this.findItem(this.basketData);
        this.basketData ? this.renderer.changeProductBtn(nodes) : null;
        this.router.clearParams();
        this.renderer.setGridProductLayout();
      });
    }
  }

  private handleCategoryFilter(): void {
    const categoryList = document.querySelector('.scroll-filter_category');

    if (categoryList) {
      categoryList.addEventListener('click', this.filter.onChangeCatalogList);
    }
  }

  public renderNewData(newData: Array<IProduct>, newRangeData: IFilterAmount, indicator?: string): void {
    this.renderer.render(newData);
    if (indicator) {
      this.filterRenderer.renderFilterRangeValues('.range-filter_stock', newRangeData);
    } else {
      this.filterRenderer.renderFilterRangeValues('.range-filter_price', newRangeData);
    }

    const currBrandData = this.calcBrandStock(newData);
    const currCategoryData = this.calcCategoryStock(newData);

    this.filterRenderer.renderFilterList('.scroll-filter_brand', currBrandData);
    this.filterRenderer.renderFilterList('.scroll-filter_category', currCategoryData);
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
    const qParams: TQParams = this.router.getObjProperties();

    for (const key in qParams) {
      if (Object.prototype.hasOwnProperty.call(qParams, key)) {
        switch (key) {
          case 'productLayout':
            qParams[key] === 'row' ? this.renderer.setRowProductLayout() : this.renderer.setGridProductLayout();
            break;

          case 'from-price':
            this.filterRenderer.changeFilterRangeValues(
              'from-price',
              '.amount__start_price',
              this.filter.getPriceRange(),
              qParams[key]
            );
            break;

          case 'to-price':
            this.filterRenderer.changeFilterRangeValues(
              'to-price',
              '.amount__end_price',
              this.filter.getPriceRange(),
              qParams[key]
            );
            break;

          case 'from-stock':
            this.filterRenderer.changeFilterRangeValues(
              'from-stock',
              '.amount__start_num',
              this.filter.getAmountRange(),
              qParams[key]
            );
            break;

          case 'to-stock':
            this.filterRenderer.changeFilterRangeValues(
              'to-stock',
              '.amount__end_num',
              this.filter.getAmountRange(),
              qParams[key]
            );
            break;

          default:
            break;
        }
      }
    }
  }

  private selectProduct(e: Event): void {
    const target = e.target as HTMLElement;
    const product = this.findNode(target, e);
    const productId = product?.id;

    localStorage.removeItem('productId');
    localStorage.setItem('productId', `${productId}`);
    // window.location.replace('#details');
  }

  private findNode(el: HTMLElement, e: Event): HTMLElement | undefined {
    let element = el;

    if (el.className.includes('product__btn')) {
      if (el.className.includes('active')) {
        e.preventDefault();
        el.classList.remove('active');
        this.details.addProductFromMain(e);
        el.textContent = 'Add in Cart';
      } else {
        e.preventDefault();
        el.classList.add('active');
        localStorage.removeItem('itemId');
        localStorage.setItem('itemId', `${el.parentElement?.parentElement?.id}`);
        this.details.addProductFromMain(e);
        el.textContent = 'Drop from Cart';
      }
    }

    if (el.parentElement?.nodeName === 'LI') {
      return el.parentElement;
    } else {
      return (element = this.findNode(element.parentElement as HTMLElement, e) as HTMLElement);
    }
  }

  private findItem(data: Ibasket): ChildNode[] {
    const items = data.purchases;
    let list: NodeListOf<ChildNode>;
    const catalogList: ChildNode[] = [];
    if (this.renderer.catalogEl) {
      list = this.renderer.catalogEl.childNodes;

      for (let i = 0; i < items.length; i++) {
        list.forEach((item) => {
          if ((item as HTMLElement).id === items[i].product.id) {
            catalogList.push(item);
          }
        });
      }
    }

    return catalogList;
  }
}
