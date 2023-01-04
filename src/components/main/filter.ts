import { IFilterAmount, IProduct } from '../../common/interface';

export default class Filter {
  private data: Array<IProduct>;
  private filteredData: Array<IProduct>;
  private priceRange: IFilterAmount;
  private amountRange: IFilterAmount;

  constructor(data: Array<IProduct>) {
    this.data = data;
    this.filteredData = this.data;
    this.priceRange = {
      from: 0,
      to: 0,
    };
    this.amountRange = {
      from: 0,
      to: 0,
    };
    this.calcInitPriceRange();
    this.calcInitAmountRange();
  }

  private calcInitPriceRange(): void {
    const cloneData = [...this.data];
    const result = cloneData.sort((a, b) => a.price - b.price);

    this.priceRange = {
      from: result[0].price,
      to: result[result.length - 1].price,
    };
  }

  private calcInitAmountRange(): void {
    const cloneData = [...this.data];
    const result = cloneData.sort((a, b) => a.stock - b.stock);

    this.amountRange = {
      from: result[0].stock,
      to: result[result.length - 1].stock,
    };
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

  public onChangePriceAmount(
    e: Event,
    changeParam: (k: string, v: string) => void,
    compareData: (data: Array<IProduct>) => void
  ): void {
    const input = e.target as HTMLInputElement;
    const inputFrom = document.getElementById('from-price') as HTMLInputElement;
    const inputTo = document.getElementById('to-price') as HTMLInputElement;

    const priceStart = document.querySelector('.amount__start_price') as HTMLSpanElement;
    const priceEnd = document.querySelector('.amount__end_price') as HTMLSpanElement;

    if (input.id === 'from-price') {
      this.changeInputFromVal(inputFrom, inputTo);
      priceStart.innerText = `${input.value}`;
      changeParam(input.id, `${input.value}`);
      this.priceRange.from = +input.value;
      this.calcProductsByRange(this.priceRange, 'price');
      compareData(this.filteredData);
    } else {
      this.changeInputToVal(inputFrom, inputTo);
      priceEnd.innerText = `${input.value}`;
      changeParam(input.id, `${input.value}`);
      this.priceRange.to = +input.value;
      this.calcProductsByRange(this.priceRange, 'price');
      compareData(this.filteredData);
    }
  }

  public onChangeStockAmount(
    e: Event,
    changeParam: (k: string, v: string) => void,
    compareData: (data: Array<IProduct>) => void
  ): void {
    const input = e.target as HTMLInputElement;
    const inputFrom = document.getElementById('from-stock') as HTMLInputElement;
    const inputTo = document.getElementById('to-stock') as HTMLInputElement;

    const stockStartNum = document.querySelector('.amount__start_num') as HTMLSpanElement;
    const stockEndNum = document.querySelector('.amount__end_num') as HTMLSpanElement;

    if (input.id === 'from-stock') {
      this.changeInputFromVal(inputFrom, inputTo);
      stockStartNum.innerText = `${input.value}`;
      changeParam(input.id, `${input.value}`);
      this.amountRange.from = +input.value;
      this.calcProductsByRange(this.amountRange, 'stock');
      compareData(this.filteredData);
    } else {
      this.changeInputToVal(inputFrom, inputTo);
      stockEndNum.innerText = `${input.value}`;
      changeParam(input.id, `${input.value}`);
      this.amountRange.to = +input.value;
      this.calcProductsByRange(this.amountRange, 'stock');
      compareData(this.filteredData);
    }
  }

  private calcProductsByRange(range: IFilterAmount, value: string): void {
    debugger;
    if (value === 'price') {
      this.filteredData = this.filteredData.filter((i) => i.price >= range.from && i.price <= range.to);
    } else {
      this.filteredData = this.filteredData.filter((i) => i.stock >= range.from && i.stock <= range.to);
    }
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
}
