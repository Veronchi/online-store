import { IFilterAmount, IFilterProduct, IProduct } from '../../common/interface';

export default class Renderer {
  private catalogEl: HTMLUListElement | null;

  constructor() {
    this.catalogEl = null;
  }

  public init(): void {
    this.catalogEl = document.querySelector('.products__catalog');
  }

  public render(data: Array<IProduct>): void {
    if (this.catalogEl) {
      this.catalogEl.innerHTML = '';
    }

    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        if (this.catalogEl) {
          const productEl = this.createProductItem(data[i]);
          this.catalogEl.append(productEl);
        }
      }
    } else {
      if (this.catalogEl) {
        this.catalogEl.innerHTML = 'Oops! No products found';
      }
    }
  }

  public onChangeProductLayout(e: Event): void {
    const target = e.target as HTMLButtonElement;
    const targetClass = target.className;
    if (target.nodeName === 'BUTTON') {
      targetClass.includes('layout__btn_row') ? this.setRowProductLayout() : this.setGridProductLayout();
    }
  }

  public setGridProductLayout(): void {
    const catalog = document.querySelector('.products__catalog') as HTMLUListElement | null;
    const btnGrid = document.querySelector('.layout__btn_grid') as HTMLButtonElement;
    const btnRow = document.querySelector('.layout__btn_row') as HTMLButtonElement;
    const elCollection: NodeListOf<HTMLDivElement> = document.querySelectorAll('.wrapper');
    const wrapper: Array<HTMLDivElement> = Array.from(elCollection);

    btnRow.classList.remove('layout__btn_active');
    btnGrid.classList.add('layout__btn_active');

    catalog?.classList.remove('products__catalog_row');
    wrapper.map((i) => i.classList.remove('wrapper_row'));
  }

  public setRowProductLayout(): void {
    const catalog = document.querySelector('.products__catalog') as HTMLUListElement | null;
    const btnGrid = document.querySelector('.layout__btn_grid') as HTMLButtonElement;
    const btnRow = document.querySelector('.layout__btn_row') as HTMLButtonElement;

    btnGrid.classList.remove('layout__btn_active');
    btnRow.classList.add('layout__btn_active');

    catalog?.classList.add('products__catalog_row');
  }

  private createProductItem(product: IProduct): HTMLLIElement {
    const li = document.createElement('li');
    const link = document.createElement('a');
    const wrapper = document.createElement('div');
    const imgWrapper = document.createElement('div');
    const descWrapper = document.createElement('div');
    const img = document.createElement('img');
    const title = document.createElement('h2');
    const rate = document.createElement('div');
    const rateNum = document.createElement('span');
    const discount = document.createElement('div');
    const price = document.createElement('div');
    const btn = document.createElement('button');

    li.className = 'product';
    link.className = 'product__link';
    wrapper.className = 'wrapper';
    imgWrapper.className = 'img-wrapper';
    img.className = 'product__img';
    title.className = 'product__title';
    rate.className = 'product__feature product__feature_rate';
    rateNum.className = 'rating';
    discount.className = 'product__feature product__feature_discount';
    price.className = 'product__feature product__feature_price';
    btn.className = 'product__btn';

    li.id = product.id;
    link.href = '#details';
    img.src = product.images[0];
    title.innerText = product.title;
    rateNum.innerText = product.rating + '';
    discount.innerText = `Discount: ${product.discountPercentage}%`;
    price.innerText = `${product.price}$`;
    btn.innerText = 'add to cart';

    imgWrapper.append(img);
    wrapper.append(imgWrapper);
    wrapper.append(title);
    rate.append(rateNum);
    descWrapper.append(rate);
    descWrapper.append(discount);
    descWrapper.append(price);
    wrapper.append(descWrapper);
    link.append(wrapper);
    link.append(btn);
    li.append(link);

    return li;
  }

  public renderFilterList(rootEl: string, list: Array<IFilterProduct>, prevList?: Array<IFilterProduct>): void {
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
        spanTotal.innerText = prevList ? `${prevList[i].stock}` : `${list[i].stock}`;
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

  public renderFilterRangeValues(fromInp: string, toInp: string, fromEl: string, toEl: string, data: IFilterAmount) {
    const fromInput = document.getElementById(fromInp) as HTMLInputElement | null;
    const toInput = document.getElementById(toInp) as HTMLInputElement | null;
    const fromSpan = document.querySelector(fromEl) as HTMLSpanElement;
    const toSpan = document.querySelector(toEl) as HTMLSpanElement;

    if (fromInput) {
      fromInput.min = localStorage.getItem(fromInp) as string;
      fromInput.max = localStorage.getItem(toInp) as string;
      fromInput.value = `${data.from}`;
    }
    if (toInput) {
      toInput.min = localStorage.getItem(fromInp) as string;
      toInput.max = localStorage.getItem(toInp) as string;
      toInput.value = `${data.to}`;
    }

    fromSpan.innerText = `${data.from}`;
    toSpan.innerText = `${data.to}`;
  }

  public changeFilterRangeValues(inp: string, el: string, data: IFilterAmount, urlData?: string) {
    const input = document.getElementById(inp) as HTMLInputElement | null;
    const span = document.querySelector(el) as HTMLSpanElement;

    if (input) {
      input.min = `${data.from}`;
      input.max = `${data.to}`;
      input.value = `${urlData}`;
      span.innerText = `${urlData}`;
    }
  }
}
