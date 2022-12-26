import { IProduct } from '../../common/interface';

export default class RendererProducts {
  private rootElement: HTMLUListElement | null;
  private rootElementName: string;

  constructor(rootElementName: string) {
    this.rootElementName = rootElementName;
    this.rootElement = null;
  }

  init() {
    this.rootElement = document.querySelector(this.rootElementName);
  }

  public render(data: Array<IProduct>): void {
    if (this.rootElement) {
      this.rootElement.innerHTML = '';
    }

    for (let i = 0; i < data.length; i++) {
      if (this.rootElement) {
        const liEl = this.createProductItem(data[i]);

        this.rootElement.append(liEl);
      }
    }
  }

  public onChangeProductLayout(e: Event) {
    const target = e.target as HTMLButtonElement;
    const targetClass = target.className;
    if (target.nodeName === 'BUTTON') {
      targetClass.includes('layout__btn_row') ? this.setRowProductLayout() : this.setGridProductLayout();
    }
  }

  public setGridProductLayout() {
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

  public setRowProductLayout() {
    const catalog = document.querySelector('.products__catalog') as HTMLUListElement | null;
    const btnGrid = document.querySelector('.layout__btn_grid') as HTMLButtonElement;
    const btnRow = document.querySelector('.layout__btn_row') as HTMLButtonElement;
    const elCollection: NodeListOf<HTMLDivElement> = document.querySelectorAll('.wrapper');
    const wrapper: Array<HTMLDivElement> = Array.from(elCollection);

    btnGrid.classList.remove('layout__btn_active');
    btnRow.classList.add('layout__btn_active');

    catalog?.classList.add('products__catalog_row');
    wrapper.map((i) => i.classList.add('wrapper_row'));
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
}
