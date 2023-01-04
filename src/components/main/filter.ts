import { IFilterAmount, IProduct } from '../../common/interface';

export default class Filter {
  private data: Array<IProduct>;
  private priceRange: IFilterAmount;
  private amountRange: IFilterAmount;

  constructor(data: Array<IProduct>) {
    this.data = data;
    this.priceRange = {
      from: 0,
      to: 0,
    };
    this.amountRange = {
      from: 0,
      to: 0,
    };
    this.calcPriceRange();
    this.calcAmountRange();
  }

  private calcPriceRange(): void {
    const cloneData = [...this.data];
    const result = cloneData.sort((a, b) => a.price - b.price);

    this.priceRange = {
      from: result[0].price,
      to: result[result.length - 1].price,
    };
  }

  private calcAmountRange(): void {
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

  public onChangePriceAmount(e: Event, changeParam: (k: string, v: string) => void): void {
    const input = e.target as HTMLInputElement;
    const inputFrom = document.getElementById('from-price') as HTMLInputElement;
    const inputTo = document.getElementById('to-price') as HTMLInputElement;

    const priceStart = document.querySelector('.amount__start_price') as HTMLSpanElement;
    const priceEnd = document.querySelector('.amount__end_price') as HTMLSpanElement;

    if (input.id === 'from-price') {
      this.changeInputFromVal(inputFrom, inputTo);
      priceStart.innerText = `${input.value}`;
      changeParam(input.id, `${input.value}`);
    } else {
      this.changeInputToVal(inputFrom, inputTo);
      priceEnd.innerText = `${input.value}`;
      changeParam(input.id, `${input.value}`);
    }
  }

  public onChangeStockAmount(e: Event, changeParam: (k: string, v: string) => void): void {
    const input = e.target as HTMLInputElement;
    const inputFrom = document.getElementById('from-stock') as HTMLInputElement;
    const inputTo = document.getElementById('to-stock') as HTMLInputElement;

    const stockStartNum = document.querySelector('.amount__start_num') as HTMLSpanElement;
    const stockEndNum = document.querySelector('.amount__end_num') as HTMLSpanElement;

    if (input.id === 'from-stock') {
      this.changeInputFromVal(inputFrom, inputTo);
      stockStartNum.innerText = `${input.value}`;
      changeParam(input.id, `${input.value}`);
    } else {
      this.changeInputToVal(inputFrom, inputTo);
      stockEndNum.innerText = `${input.value}`;
      changeParam(input.id, `${input.value}`);
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
