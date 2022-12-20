import { products, IProduct } from '../../products';

interface IRenderProps {
  rootElement: string;
}

class Controller {
  private renderer: RendererProducts;
  private filter: Filter;
  private data: Array<IProduct>;

  constructor({ rootElement }: IRenderProps) {
    this.data = [];
    this.renderer = new RendererProducts(rootElement);
    this.filter = new Filter();
    this.initEvents();
  }

  public fetchData(): void {
    this.data = products;
  }

  public getData(): Array<IProduct> {
    return this.data;
  }

  public draw(): void {
    this.renderer.render(this.data);
  }

  private initEvents() {
    this.onChangeProdLayout();
  }

  private onChangeProdLayout() {
    const btnWrapper = document.querySelector<HTMLDivElement>('.layout');

    if (btnWrapper) btnWrapper.addEventListener('click', this.renderer.changeProdLayout);
  }
}

class Filter {
  z: string;
  constructor() {
    this.z = 'a';
  }
}

class RendererProducts {
  private rootElement: HTMLUListElement | null;

  constructor(rootElement: string) {
    this.rootElement = document.querySelector(rootElement);
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

  public changeProdLayout(e: Event) {
    const catalog = document.querySelector('.products__catalog') as HTMLUListElement | null;
    const elCollection: NodeListOf<HTMLDivElement> = document.querySelectorAll('.wrapper');
    const wrapper: Array<HTMLDivElement> = Array.from(elCollection);
    const targetClass = (e.target as HTMLButtonElement).className;

    if (targetClass.includes('layout__btn_row')) {
      catalog?.classList.add('products__catalog_row');
      wrapper.map((i) => i.classList.add('wrapper_row'));
    } else {
      catalog?.classList.remove('products__catalog_row');
      wrapper.map((i) => i.classList.remove('wrapper_row'));
    }
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

const controller = new Controller({
  rootElement: '.products__catalog',
});
controller.fetchData();
controller.draw();
