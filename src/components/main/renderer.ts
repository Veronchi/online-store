import { IProduct } from '../../common/interface';

export default class Renderer {
  public catalogEl: HTMLUListElement | null;

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
    btn.innerText = 'Add in Cart';

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

  public changeProductBtn(data: ChildNode[]): void {
    data.forEach((i) => {
      i.childNodes.forEach((i) => {
        const item = i.childNodes[1] as HTMLElement;
        item.classList.add('active');
        item.textContent = 'Drop from Cart';
      });
    });
  }
}
