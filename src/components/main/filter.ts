import { IFilterAmount, IProduct } from '../../common/interface';

export default class Filter {
  private data: Array<IProduct>;
  public dataToList: Array<IProduct>;
  private filteredData: Array<IProduct>;
  private priceRange: IFilterAmount;
  private amountRange: IFilterAmount;
  public categoryData: Array<string>;
  public brandData: Array<string>;
  private serachInput: string;
  private sortParam: string;

  constructor(data: Array<IProduct>) {
    this.data = data;
    this.dataToList = [];
    this.filteredData = this.data;
    this.priceRange = {
      from: 0,
      to: 0,
    };
    this.amountRange = {
      from: 0,
      to: 0,
    };
    this.serachInput = '';
    this.sortParam = '';
    this.categoryData = [];
    this.brandData = [];

    this.calcInitPriceRange(this.data);
    this.calcInitAmountRange(this.data);
  }

  public getSearchQuery() {
    return this.serachInput;
  }

  public addFilterCatergory(name: string): void {
    this.categoryData.push(name);
  }

  public addFilterBrand(name: string): void {
    this.brandData.push(name);
  }

  public removeFilterCatergory(name: string): void {
    this.categoryData = this.categoryData.filter((item) => item !== name);
  }

  public removeFilterBrand(name: string): void {
    this.brandData = this.brandData.filter((item) => item !== name);
  }

  public getFilteredData(): Array<IProduct> {
    return this.filteredData;
  }

  public calcInitPriceRange(data: Array<IProduct>): void {
    const cloneData = [...data];
    const result = cloneData.sort((a, b) => a.price - b.price);

    this.priceRange = {
      from: result[0].price,
      to: result[result.length - 1].price,
    };
  }

  public calcInitAmountRange(data: Array<IProduct>): void {
    const cloneData = [...data];
    const result = cloneData.sort((a, b) => a.stock - b.stock);

    this.amountRange = {
      from: result[0].stock,
      to: result[result.length - 1].stock,
    };
  }

  public changeFoundAmount(num: number): void {
    const foundSpan = document.querySelector('.found__amount');

    foundSpan ? (foundSpan.innerHTML = `Found: ${num}`) : null;
  }

  public getPriceRange(): IFilterAmount {
    return this.priceRange;
  }
  public getAmountRange(): IFilterAmount {
    return this.amountRange;
  }

  public async copyFilters(): Promise<void> {
    const href = window.location.href;

    await navigator.clipboard.writeText(href);
  }

  onChangeList(): void {
    let data;
    if (this.brandData.length > 0 && this.categoryData.length > 0) {
      data = this.filteredData.filter(
        (item) => this.brandData.includes(item.brand) && this.categoryData.includes(item.category)
      );
    } else if (this.brandData.length > 0) {
      data = this.filteredData.filter((item) => this.brandData.includes(item.brand));
    } else {
      data = this.filteredData.filter((item) => this.categoryData.includes(item.category));
    }
    this.filteredData = this.brandData.length < 1 && this.categoryData.length < 1 ? this.data : data;
  }

  public onChangePriceAmount(): void {
    // const input = e.target as HTMLInputElement;
    const inputFrom = document.getElementById('from-price') as HTMLInputElement;
    const inputTo = document.getElementById('to-price') as HTMLInputElement;

    const priceStart = document.querySelector('.amount__start_price') as HTMLSpanElement;
    const priceEnd = document.querySelector('.amount__end_price') as HTMLSpanElement;

    // if (input.id === 'from-price') {
    priceStart.innerText = `${inputFrom.value}`;
    this.priceRange.from = +inputFrom.value;
    this.changeInputFromVal(inputFrom, inputTo);
    // this.calcProductsByRangeNEW();
    // this.calcInitAmountRange(this.filteredData);
    // renderNewData(this.filteredData, this.getAmountRange(), 'stock');
    // changeParam(input.id, `${input.value}`);
    // this.changeFoundAmount(this.filteredData.length);
    // } else {
    priceEnd.innerText = `${inputTo.value}`;
    this.priceRange.to = +inputTo.value;
    this.changeInputToVal(inputFrom, inputTo);
    // this.calcProductsByRangeNEW();
    // this.calcInitAmountRange(this.filteredData);
    // renderNewData(this.filteredData, this.getAmountRange(), 'stock');
    // changeParam(input.id, `${input.value}`);
    // this.changeFoundAmount(this.filteredData.length);
    // }
  }

  public onChangeStockAmount(): void {
    // const input = e.target as HTMLInputElement;
    const inputFrom = document.getElementById('from-stock') as HTMLInputElement;
    const inputTo = document.getElementById('to-stock') as HTMLInputElement;

    const stockStartNum = document.querySelector('.amount__start_num') as HTMLSpanElement;
    const stockEndNum = document.querySelector('.amount__end_num') as HTMLSpanElement;

    // if (input.id === 'from-stock') {
    this.changeInputFromVal(inputFrom, inputTo);
    stockStartNum.innerText = `${inputFrom.value}`;
    this.amountRange.from = +inputFrom.value;
    // this.calcProductsByRangeNEW();
    // this.calcInitPriceRange(this.filteredData);
    // renderNewData(this.filteredData, this.getPriceRange());
    // changeParam(input.id, `${input.value}`);
    // this.changeFoundAmount(this.filteredData.length);
    // } else {
    this.changeInputToVal(inputFrom, inputTo);
    stockEndNum.innerText = `${inputTo.value}`;
    this.amountRange.to = +inputTo.value;
    // this.calcProductsByRangeNEW();
    // this.calcInitPriceRange(this.filteredData);
    // renderNewData(this.filteredData, this.getPriceRange());
    // changeParam(input.id, `${input.value}`);
    // this.changeFoundAmount(this.filteredData.length);
    // }
  }

  public onChangeCatalogList(e: Event) {
    // const target = e.target as HTMLElement;
    // console.log(this.data);
    // // debugger;
    // if (target.innerHTML) {
    //   this.filteredData = this.data.filter((i) => i.category === target.innerHTML);
    // } else {
    //   this.filteredData = this.data.filter((i) => i.category === target.id);
    // }
    // console.log(this.filteredData);
  }

  private calcProductsByRange(range: IFilterAmount, value: string): void {
    if (value === 'price') {
      this.filteredData = this.data.filter((i) => i.price >= range.from && i.price <= range.to);
    } else {
      this.filteredData = this.data.filter((i) => i.stock >= range.from && i.stock <= range.to);
    }
  }

  public calcProductsByRangeNEW(): void {
    const priceRange = this.getPriceRange();
    const stockRange = this.getAmountRange();
    // if (value === 'price') {
    // debugger
    this.filteredData = this.filteredData.filter(
      (i) =>
        i.price >= priceRange.from && i.price <= priceRange.to && i.stock >= stockRange.from && i.stock <= stockRange.to
    );
    this.dataToList = this.data.filter(
      (i) =>
        i.price >= priceRange.from && i.price <= priceRange.to && i.stock >= stockRange.from && i.stock <= stockRange.to
    );
    // } else {
    //   this.filteredData = this.data.filter((i) => i.stock >= range.from && i.stock <= range.to);
    // }
  }

  public filter(): void {
    this.filteredData = this.data;
    this.onChangeList();
    this.onChangePriceAmount();
    this.onChangeStockAmount();
    this.calcProductsByRangeNEW();
    this.filterBySearchParam();
    this.sortBy();

    this.changeFoundAmount(this.filteredData.length);

    // this.saveFilteredData();
    // this.calcInitPriceRange(this.filteredData);
    // this.calcInitAmountRange(this.filteredData);
  }

  private changeInputFromVal(start: HTMLInputElement, end: HTMLInputElement): void {
    const minGap = 0;

    if (parseInt(end.value) - parseInt(start.value) <= minGap) {
      start.value = `${parseInt(end.value) - minGap}`;
    }
  }

  private changeInputToVal(start: HTMLInputElement, end: HTMLInputElement): void {
    const minGap = 0;

    if (parseInt(end.value) - parseInt(start.value) <= minGap) {
      end.value = `${parseInt(start.value) - minGap}`;
    }
  }

  public addSearchParam(input: string) {
    this.serachInput = input;
  }

  private filterBySearchParam(): void {
    this.filteredData = this.filteredData.filter((item) =>
      item.title.toLowerCase().includes(this.serachInput.toLowerCase())
    );
  }

  public addSortParam(input: string): void {
    this.sortParam = input;
  }

  private sortBy(): void {
    switch (this.sortParam) {
      case 'priceDESC':
        this.filteredData.sort((a: IProduct, b: IProduct) => a.price - b.price);
        break;
      case 'priceASC':
        this.filteredData.sort((a: IProduct, b: IProduct) => b.price - a.price);
        break;
      case 'ratingDESC':
        this.filteredData.sort((a: IProduct, b: IProduct) => a.rating - b.rating);
        break;
      case 'ratinASC':
        this.filteredData.sort((a: IProduct, b: IProduct) => b.rating - a.rating);
        break;
      case 'discountDESC':
        this.filteredData.sort((a: IProduct, b: IProduct) => a.discountPercentage - b.discountPercentage);
        break;
      case 'discountASC':
        this.filteredData.sort((a: IProduct, b: IProduct) => b.discountPercentage - a.discountPercentage);
        break;

      default:
        break;
    }
  }

  // public saveFilteredData() {
  //   localStorage.setItem('CurrFilteredData', JSON.stringify(this.filteredData));
  //   // console.log(this.filteredData);
  // }
}
