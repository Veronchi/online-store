import { threadId } from 'worker_threads';
import Component from '../../common/component';
import { IProduct, IPurchase, IBasket } from '../../common/interface';
import { products} from '../../products';
import './style-cart.scss';



export default class Cart extends Component {

  constructor(name: string) {
    super(name);
  }

  public init(): void {
    console.log('cart');
    const btn = document.querySelector('.cart-summary__submit') as HTMLElement;
    btn.addEventListener('click', () => basket.addProducts());
    this.draw();

    this.initEvents();
  }

  public draw(): void {
    const cartProducts = document.querySelector('.cart-products') as HTMLElement;
    cartProducts.innerHTML = '';

    basket.purchases.forEach((el: IPurchase) => {
      const cartEl = this.createCartProduct(el.product);
      cartProducts.append(cartEl);
    });
  }

  private changeCountProduct(e: Event): void {
    const target = e.target as HTMLElement;
    const productId = target.parentElement?.parentElement?.parentElement?.dataset.id as string;

    const newCount = basket.changeProductCount(productId, String(target.textContent));

    if (newCount > 0) {
      const searchBlock = target.parentElement?.parentElement as HTMLElement;
      const productCount = searchBlock.querySelector('.cart-products__quantity-count') as HTMLElement;
      productCount.textContent = `${newCount}`;

      const searchTotal = target.parentElement?.parentElement?.parentElement as HTMLElement;
      const subTotal = searchTotal.querySelector('.cart-products__subtotal') as HTMLElement;
      subTotal.textContent = `${newCount * basket.getProduct(productId).price}$`;
    } else {
      this.draw();
      this.initEvents();
    }
  }

  private deleteProduct(e: Event): void {
    const target = e.target as HTMLElement;
    const productId = target.parentElement?.dataset.id as string;
    basket.deleteProduct(productId);
    this.draw();
    this.initEvents();
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
    liPrice.textContent = `${product.price}$`;
    liDiscount.textContent = `${product.discountPercentage}%`;
    img.src = product.thumbnail;
    img.alt = `${product.title}`;
    count.textContent = `${basket.getProductCount(product.id)}`;
    stock.textContent = `Stock: ${product.stock}`;
    btnPlus.textContent = '+';
    btnMinus.textContent = '-';
    liSubtotal.textContent = `${basket.getProductCount(product.id) * product.price}$`;

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
}

export class Basket {
  public purchases: IPurchase[];
  public totalSumm: number;
  public totalCount: number;

  constructor() {
    const basketSave:string | null = localStorage.getItem('basket');
    if (basketSave) {
      const basketValue = JSON.parse(basketSave);
      this.purchases = basketValue.purchases;
      this.totalCount = basketValue.totalCount;
      this.totalSumm = basketValue.totalSumm;
    } else {
      this.purchases = [];
      this.totalCount = 0;
      this.totalSumm = 0;
    }
  }

  public init(): void {
    console.log(this.purchases);
  }

  public addProducts(): void {
    const id: string | null = localStorage.getItem('productId');
    if (id) {
      if (this.isInBasket(id)) {
        this.purchases[this.getPurchaseId(id)].count++;
      } else {
        this.purchases.push({count: 1, product: this.getProduct(id)});
        this.totalCount++;
        this.totalSumm += this.getProduct(id).price;
      }
      this.setToLocalStorage();
    }
  }

  public getProductCount(id: string): number {
    let result = 0;
    this.purchases.forEach((el: IPurchase) => {
      if (el.product.id === id) result = el.count;
    })
    return result;
  }

  public changeProductCount(id: string, operation: string): number {
    const purchaseId =  this.getPurchaseId(id);

    if (operation === '+') {
      if (this.purchases[purchaseId].count < this.purchases[purchaseId].product.stock) {
        this.purchases[purchaseId].count += 1;
      }
    } else if (operation === '-') {
      if (this.purchases[purchaseId].count > 1) {
        this.purchases[purchaseId].count -= 1;
      } else {
        this.deleteProduct(id);
        return 0;
      }
    }
    this.setToLocalStorage();
    return this.purchases[purchaseId].count;
  }

  public deleteProduct(id: string): void {
    const purchaseId =  this.getPurchaseId(id);
    this.purchases.splice(purchaseId, 1);
    this.setToLocalStorage();
  }

  public getProduct(id: string | null): IProduct {
    const productsArray: IProduct[] = products.filter((element) => element.id === id);
    return JSON.parse(JSON.stringify(productsArray[0]));
  }

  private isInBasket(id: string): boolean {
    let result = false;
    this.purchases.forEach((el: IPurchase) => {
      if (el.product.id === id) result = true;
    })
    return result;
  }

  private getPurchaseId(id: string): number {
    let result = -1;
    for (let i = 0; i < this.purchases.length; i++) {
      if (this.purchases[i].product.id === id) {
        result = i;
      }
    }
    return result;
  }

  public setToLocalStorage(): void {
    localStorage.setItem('basket', JSON.stringify(this));
  }
}

const basket = new Basket();


