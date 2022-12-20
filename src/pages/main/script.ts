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
    console.log(1111);
  }

  private createProductItem(product: IProduct): HTMLLIElement {
    const li = document.createElement('li');
    const link = document.createElement('a');
    const wrapper = document.createElement('div');
    const img = document.createElement('img');
    const title = document.createElement('h2');
    const rate = document.createElement('div');
    const rateNum = document.createElement('span');
    const discount = document.createElement('div');
    const price = document.createElement('div');
    const btn = document.createElement('button');

    li.className = 'product';
    link.className = 'product__link';
    wrapper.className = 'img-wrapper';
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
    discount.innerText = `Discount: ${product.discountPercentage}`;
    price.innerText = `${product.price}$`;
    btn.innerText = 'add to cart';

    wrapper.append(img);
    link.append(wrapper);
    link.append(title);
    rate.append(rateNum);
    link.append(rate);
    link.append(discount);
    link.append(price);
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
