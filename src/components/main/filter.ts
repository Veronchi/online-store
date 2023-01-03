export default class Filter {
  public onChangePriceAmount(e: Event): void {
    const input = e.target as HTMLInputElement;
    const inputFrom = document.getElementById('from-price') as HTMLInputElement;
    const inputTo = document.getElementById('to-price') as HTMLInputElement;
    const minGap = 0;

    const priceStart = document.querySelector('.amount__start_price') as HTMLSpanElement;
    const priceEnd = document.querySelector('.amount__end_price') as HTMLSpanElement;

    if (input.id === 'from-price') {
      this.changeInputFromVal(inputFrom, inputTo, minGap);
      priceStart.innerText = `${input.value}`;
    } else {
      this.changeInputToVal(inputFrom, inputTo, minGap);
      priceEnd.innerText = `${input.value}`;
    }
  }

  public onChangeStockAmount(e: Event): void {
    const input = e.target as HTMLInputElement;
    const inputFrom = document.getElementById('from-stock') as HTMLInputElement;
    const inputTo = document.getElementById('to-stock') as HTMLInputElement;
    const minGap = 0;

    const stockStartNum = document.querySelector('.amount__start_num') as HTMLSpanElement;
    const stockEndNum = document.querySelector('.amount__end_num') as HTMLSpanElement;

    if (input.id === 'from-stock') {
      this.changeInputFromVal(inputFrom, inputTo, minGap);
      stockStartNum.innerText = `${input.value}`;
    } else {
      this.changeInputToVal(inputFrom, inputTo, minGap);
      stockEndNum.innerText = `${input.value}`;
    }
  }

  private changeInputFromVal(start: HTMLInputElement, end: HTMLInputElement, minGap: number): void {
    if (parseInt(end.value) - parseInt(start.value) <= minGap) {
      start.value = `${parseInt(end.value) - minGap}`;
    }
  }

  private changeInputToVal(start: HTMLInputElement, end: HTMLInputElement, minGap: number): void {
    if (parseInt(end.value) - parseInt(start.value) <= minGap) {
      end.value = `${parseInt(start.value) - minGap}`;
    }
  }
}
