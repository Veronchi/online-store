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

    const maxItem = document.querySelector('.cart-pagination__input') as HTMLInputElement;
    const itemPerPage = Number(maxItem.value);

    const blockProducts = document.querySelector('.cart-products') as HTMLElement;
    blockProducts.style.height = `${Math.min(itemPerPage, this.basket.getTotalCount()) * 100}px`;

    const btn = document.querySelector('.cart-summary__submit') as HTMLElement;
    btn.addEventListener('click', () => this.basket.addProduct());
    this.draw();
    this.drawSummary();
    this.basket.drawHeader();
    this.initEvents();
  }

  public draw(): void {
    const cartProducts = document.querySelector('.cart-products') as HTMLElement;
    cartProducts.innerHTML = '';

    if (this.basket.purchases.length > 0) {
      this.changePage(1);
    } else 
    {
      const cartProducts = document.querySelector('.cart-container') as HTMLElement;
      cartProducts.innerHTML = '';

      const cartEl = this.createEmptyCart();
      cartProducts.append(cartEl);
    }
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
      } else {
        const currentPage = Number(document.querySelector('.cart-pagination__count')?.textContent);
        this.changePage(Math.min(currentPage, this.getNumPages()));
      }
      this.drawSummary();
    }
  }

  private deleteProduct(e: Event): void {
    const target = e.target as HTMLElement;
    const product = this.findNode(target);
    const productId = product?.dataset.id;

    if (productId) {
      const currentPage = Number(document.querySelector('.cart-pagination__count')?.textContent);
      this.basket.deleteProduct(productId);
      this.changePage(Math.min(currentPage, this.getNumPages()));
      this.drawSummary();
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
    this.handlerPrevPage();
    this.handlerNextPage();
    this.handlerItemsPerPage();
  }
  
  private handlerChangeCount():void {
    const btnCount: NodeList = document.querySelectorAll('.ride-button');
    btnCount.forEach((el) => el.addEventListener('click', (event: Event) => this.changeCountProduct(event)));
  }

  private handlerDeleteProduct():void {
    const btnCount: NodeList = document.querySelectorAll('.cart-products__delete');
    btnCount.forEach((el) => el.addEventListener('click', (event: Event) => this.deleteProduct(event)));
  }

  private handlerPrevPage():void {
    const btnPrev = document.querySelector('.cart-pagination__left') as HTMLButtonElement;
    btnPrev.addEventListener('click', () => this.prevPage());
  }

  private handlerNextPage():void {
    const btnNext = document.querySelector('.cart-pagination__right') as HTMLButtonElement;
    btnNext.addEventListener('click', () => this.nextPage());
  }

  private handlerItemsPerPage():void {
    const btnNext = document.querySelector('.cart-pagination__input') as HTMLButtonElement;
    btnNext.addEventListener('input', () => this.changeItemsPerPage());
  }

  private createCartProduct(product: IProduct): HTMLUListElement {
    const ul = document.createElement('ul');
    const liNum = document.createElement('li');
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
    liNum.className = 'cart-products__num';
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
    liNum.textContent = `${this.basket.getProductPosition(product.id) + 1}`
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
    ul.append(liNum);
    ul.append(liImage);
    ul.append(liDesc);
    ul.append(liPrice);
    ul.append(liDiscount);
    ul.append(liQuantity);
    ul.append(liSubtotal);
    ul.append(liDelete);

    return ul;
  }

  private createEmptyCart():HTMLElement {
    const emptyCArt = document.createElement('p');
    emptyCArt.className = 'cart-products__empty';
    emptyCArt.textContent = 'Cart is Empty'
    return emptyCArt;
  }

  private findNode(el: HTMLElement): HTMLElement | undefined {
    let element = el;

    if (el.parentElement?.nodeName === 'UL') {
      return el.parentElement;
    } else {
      return (element = this.findNode(element.parentElement as HTMLElement) as HTMLElement);
    }
  }

  private prevPage(): void {
    let currentPage = Number(document.querySelector('.cart-pagination__count')?.textContent);
    if (currentPage > 1) {
      currentPage--;
      this.changePage(currentPage);
    }
  }

  private nextPage(): void {
    let currentPage = Number(document.querySelector('.cart-pagination__count')?.textContent);
    if (currentPage < this.getNumPages()) {
      currentPage++;
      this.changePage(currentPage);
    }
  }

  private changePage(page: number): void {
    const pageCount = document.querySelector('.cart-pagination__count') as HTMLElement;
    pageCount.textContent = `${page}`;

    const maxItem = document.querySelector('.cart-pagination__input') as HTMLInputElement;
    const itemPerPage = Number(maxItem.value);

    const nextPage = document.querySelector('.cart-pagination__right') as HTMLButtonElement;
    const prevPage = document.querySelector('.cart-pagination__left') as HTMLButtonElement;

    const cartProducts = document.querySelector('.cart-products') as HTMLElement;
    cartProducts.innerHTML = '';

    for (let i = (page - 1) * itemPerPage; i < (page * itemPerPage) && i < this.basket.purchases.length; i++) {
      const cartEl = this.createCartProduct(this.basket.purchases[i].product);
      cartProducts.append(cartEl);
    }

    if (page === 1) {
      prevPage.style.visibility = "hidden";
    } else {
      prevPage.style.visibility = "visible";
    }

    if (page === this.getNumPages()) {
      nextPage.style.visibility = "hidden";
    } else {
      nextPage.style.visibility = "visible";
    }

    this.handlerChangeCount();
    this.handlerDeleteProduct();
  }

  private changeItemsPerPage() {
    const maxItem = document.querySelector('.cart-pagination__input') as HTMLInputElement;
    const itemPerPage = Number(maxItem.value);
    
    const blockProducts = document.querySelector('.cart-products') as HTMLElement;
    blockProducts.style.height = `${Math.min(itemPerPage, this.basket.getTotalCount()) * 100}px`;

    const pageCount = document.querySelector('.cart-pagination__count') as HTMLElement;
    const curPage = Number(pageCount.textContent);

    if (curPage > this.getNumPages()) {
      this.changePage(this.getNumPages());
    } else {
      this.changePage(curPage);
    }
  }

  private getNumPages(): number {
    const maxItem = document.querySelector('.cart-pagination__input') as HTMLInputElement;
    return Math.ceil(this.basket.purchases.length / Number(maxItem.value));
  }

}



