import Component from '../../common/component';
import Basket from '../../common/basket';
import { IPurchase, IProduct } from '../../common/interface';
import './style-cart.scss';

export default class Cart extends Component {
  private basket: Basket;

  constructor(name: string) {
    super(name);
    this.basket = new Basket();
  }

  public init(): void {
    console.log('cart');
    const btn = document.querySelector('.cart-summary__submit') as HTMLElement;
    btn.addEventListener('click', () => this.basket.addProduct());
    this.draw();
    this.drawSummary();
    this.initEvents();
  }

  public draw(): void {
    const cartProducts = document.querySelector('.cart-products') as HTMLElement;
    cartProducts.innerHTML = '';

    this.basket.purchases.forEach((el: IPurchase) => {
      const cartEl = this.createCartProduct(el.product);
      cartProducts.append(cartEl);
    });
  }

  private changeCountProduct(e: Event): void {
    const target = e.target as HTMLElement;
    const product = this.findNode(target);
    const productId = product?.dataset.id;

    if (productId) {
      const newCount = this.basket.changeProductCount(productId, String(target.textContent));
  
      if (newCount > 0) {
        const searchBlock = target.parentElement?.parentElement as HTMLElement;
        const productCount = searchBlock.querySelector('.cart-products__quantity-count') as HTMLElement;
        productCount.textContent = `${newCount}`;
  
        const searchTotal = target.parentElement?.parentElement?.parentElement as HTMLElement;
        const subTotal = searchTotal.querySelector('.cart-products__subtotal') as HTMLElement;
        subTotal.textContent = `${(newCount * this.basket.getProduct(productId).price * 
          (100 - this.basket.getProduct(productId).discountPercentage) / 100).toFixed(2)}$`;
        this.drawSummary();
      } else {
        this.draw();
        this.initEvents();
      }
    }
  }

  private deleteProduct(e: Event): void {
    const target = e.target as HTMLElement;
    const product = this.findNode(target);
    const productId = product?.dataset.id;

    if (productId) {
      this.basket.deleteProduct(productId);
      this.draw();
      this.drawSummary();
      this.initEvents();
    }
  }

  private drawSummary() {
    const countProducts = document.querySelector('.cart-summary__products-count') as HTMLElement;
    countProducts.textContent = `${this.basket.getTotalCount()}`;

    const countDiscount = document.querySelector('.cart-summary__discount-count') as HTMLElement;
    countDiscount.textContent = `${this.basket.getTotalDiscount().toFixed(2)}$`;

    const countSumm = document.querySelector('.cart-summary__total-count') as HTMLElement;
    countSumm.textContent = `${this.basket.getTotalSumm().toFixed(2)}$`;
  }

  private initEvents():void {
    this.handlerChangeCount();
    this.handlerDeleteProduct();
  }
  
  private handlerChangeCount():void {
    const btnCount: NodeList = document.querySelectorAll('.ride-button');
    btnCount.forEach((el) => el.addEventListener('click', (event: Event) => this.changeCountProduct(event)));
  }

  private handlerDeleteProduct():void {
    const btnCount: NodeList = document.querySelectorAll('.cart-products__delete');
    btnCount.forEach((el) => el.addEventListener('click', (event: Event) => this.deleteProduct(event)));
  }

  private createCartProduct(product: IProduct): HTMLUListElement {
    const ul = document.createElement('ul');
    const liImage = document.createElement('li');
    const liDesc = document.createElement('li');
    const liPrice = document.createElement('li');
    const liDiscount = document.createElement('li');
    const liQuantity = document.createElement('li');
    const liSubtotal = document.createElement('li');
    const liDelete = document.createElement('li');
    const img = document.createElement('img');
    const count = document.createElement('p');
    const div = document.createElement('div');
    const stock = document.createElement('p');
    const btnPlus = document.createElement('button');
    const btnMinus = document.createElement('button');

    ul.className = 'cart-products__items';
    liImage.className = 'cart-products__image';
    liDesc.className = 'cart-products__description';
    liPrice.className = 'cart-products__price';
    liDiscount.className = 'cart-products__discont';
    liQuantity.className = 'cart-products__quantity';
    liSubtotal.className = 'cart-products__subtotal';
    liDelete.className = 'cart-products__delete';
    img.className = 'cart-products__img';
    count.className = 'cart-products__quantity-count';
    div.className = 'cart-products__quantity-ride';
    stock.className = 'cart-products__stock';
    btnPlus.className = 'ride-button cart-products__quantity-up';
    btnMinus.className = 'ride-button cart-products__quantity-down';

    ul.setAttribute('data-id', product.id);
    liDesc.textContent = product.description;
    liPrice.textContent = `${product.price.toFixed(2)}$`;
    liDiscount.textContent = `${product.discountPercentage}%`;
    img.src = product.thumbnail;
    img.alt = `${product.title}`;
    count.textContent = `${this.basket.getProductCount(product.id)}`;
    stock.textContent = `Stock: ${product.stock}`;
    btnPlus.textContent = '+';
    btnMinus.textContent = '-';
    liSubtotal.textContent = `${(this.basket.getProductCount(product.id) * product.price * (100 - product.discountPercentage) / 100).toFixed(2)}$`;
    
    div.append(btnPlus);
    div.append(btnMinus);
    div.append(stock);
    liQuantity.append(count);
    liQuantity.append(div);
    liImage.append(img);
    ul.append(liImage);
    ul.append(liDesc);
    ul.append(liPrice);
    ul.append(liDiscount);
    ul.append(liQuantity);
    ul.append(liSubtotal);
    ul.append(liDelete);

    return ul;
  }

  private findNode(el: HTMLElement): HTMLElement | undefined {
    let element = el;

    if (el.parentElement?.nodeName === 'UL') {
      return el.parentElement;
    } else {
      return (element = this.findNode(element.parentElement as HTMLElement) as HTMLElement);
    }
  }
}



