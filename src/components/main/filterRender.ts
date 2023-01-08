import { IFilterAmount, IFilterProduct, IFilterInitValues, IFilterMapElements } from '../../common/interface';

export default class FilterRenderer {
  private initElements: IFilterInitValues;
  private mapRootElements: IFilterMapElements;
  constructor(elements: IFilterInitValues) {
    this.initElements = elements;
    this.mapRootElements = { lists: {}, ranges: {} };
  }

  public init() {
    const rootElements: IFilterMapElements = {
      lists: {},
      ranges: {},
    };
    this.initElements.lists.map((item) => {
      const el = document.querySelector(item.root) as HTMLInputElement | null;
      const propName = item.root;
      if (el) this.mapRootElements.lists[propName] = el;
    });

    this.initElements.ranges.map((item) => {
      const el = document.querySelector(item.root) as HTMLInputElement | null;
      const propName = item.root;
      if (el) this.mapRootElements.ranges[propName] = el;
    });
    this.mapRootElements = rootElements;
  }

  // public renderAll() {
  // this.renderFilterList();
  // this.renderFilterRangeValues();
  // this.changeFilterRangeValues();
  // }

  public renderFilterList(rootEl: string, list: Array<IFilterProduct>): void {
    const root: HTMLElement | null = document.querySelector(rootEl);

    if (root) {
      root.innerHTML = '';
      for (let i = 0; i < list.length; i++) {
        const li = document.createElement('li');
        const input = document.createElement('input');
        const label = document.createElement('label');
        const spanCurr = document.createElement('span');
        const spanTotal = document.createElement('span');
        li.classList.add('scroll-filter__item');
        input.classList.add('scroll-filter__input');
        input.id = list[i].name;
        input.type = 'checkbox';
        input.name = list[i].name;
        label.classList.add('scroll-filter__label');
        label.htmlFor = list[i].name;
        label.innerText = list[i].name;
        spanCurr.classList.add('scroll-filter__amount', 'scroll-filter__amount_current');
        spanTotal.classList.add('scroll-filter__amount', 'scroll-filter__amount_total');
        spanCurr.innerText = `${list[i].stock}/`;
        if(spanTotal.innerText.length < 1) spanTotal.innerText = `${list[i].stock}`;
        li.append(input);
        li.append(label);
        li.append(spanCurr);
        li.append(spanTotal);

        if (root) {
          root.append(li);
        }
      }
    }
  }

  public renderFilterRangeValues(rootName: string, data: IFilterAmount) {
    const fromInput = document.querySelector(`${rootName} .range-filter__input_from`) as HTMLInputElement | null;
    const toInput = document.querySelector(`${rootName} .range-filter__input_to`) as HTMLInputElement | null;
    const fromSpan = document.querySelector(`${rootName} .amount__start`) as HTMLSpanElement;
    const toSpan = document.querySelector(`${rootName} .amount__end`) as HTMLSpanElement;

    if (fromInput) {
      fromInput.min = localStorage.getItem(fromInput.id) as string;
      toInput ? (fromInput.max = localStorage.getItem(toInput.id) as string) : null;
      fromInput.value = `${data.from}`;
    }
    if (toInput) {
      fromInput ? (toInput.min = localStorage.getItem(fromInput.id) as string) : null;
      toInput.max = localStorage.getItem(toInput.id) as string;
      toInput.value = `${data.to}`;
    }

    fromSpan.innerText = `${data.from}`;
    toSpan.innerText = `${data.to}`;
  }

  public changeFilterRangeValues(inp: string, el: string, data: IFilterAmount, urlData?: string) {
    const input = document.getElementById(inp) as HTMLInputElement | null;
    const span = document.querySelector(el) as HTMLSpanElement;
    // debugger;

    if (input) {
      input.min = `${data.from}`;
      input.max = `${data.to}`;
      input.value = `${urlData}`;
      span.innerText = `${urlData}`;
    }
  }
}
