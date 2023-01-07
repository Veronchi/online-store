import { IProduct, IPurchase } from './interface';
import { products} from '../products';

export default class Basket {
  public purchases: IPurchase[];
  public totalSumm: number;
  public totalCount: number;
  public totalDiscount: number;

  constructor() {
    const basketSave:string | null = localStorage.getItem('basket');
    if (basketSave) {
      const basketValue = JSON.parse(basketSave);
      this.purchases = basketValue.purchases;
      this.totalCount = basketValue.totalCount;
      this.totalSumm = basketValue.totalSumm;
      this.totalDiscount = basketValue.totalDiscount;
    } else {
      this.purchases = [];
      this.totalCount = 0;
      this.totalSumm = 0;
      this.totalDiscount = 0;
    }
  }

  public init(): void {
    console.log(this.purchases);
  }

  public addProduct(): void {
    const id: string | null = localStorage.getItem('productId');
    if (id) {
      if (this.isInBasket(id)) {
        if (this.purchases[this.getPurchaseId(id)].count < this.purchases[this.getPurchaseId(id)].product.stock) {
          this.purchases[this.getPurchaseId(id)].count++;
        }
      } else {
        this.purchases.push({count: 1, product: this.getProduct(id)});
        this.totalCount++;
        this.totalSumm += this.getProduct(id).price;
      }
      this.setTotals();
      this.drawHeader();
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

  public getProductPosition(id: string): number {
    let result = 0;
    this.purchases.forEach((el: IPurchase, index: number) => {
      if (el.product.id === id) result = index;
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
    this.setTotals();
    this.drawHeader();
    this.setToLocalStorage();
    return this.purchases[purchaseId].count;
  }

  private setTotals(): void {
    let count = 0;
    let summ = 0;
    let discount = 0;
    this.purchases.forEach((element: IPurchase) => {
      count += element.count;
      summ +=element.count * element.product.price * (100 - element.product.discountPercentage) / 100;
      discount += element.count * element.product.price * element.product.discountPercentage / 100;
    })
    this.totalCount = count;
    this.totalSumm = Math.round(summ * 100) / 100;
    this.totalDiscount = Math.round(discount * 100) / 100;
  }

  public getTotalSumm(): number {
    return this.totalSumm;
  }

  public getTotalCount(): number {
    return this.totalCount;
  }

  public getTotalDiscount(): number {
    return this.totalDiscount;
  }

  public getTotalProducts(): number {
    return this.purchases.length;
  }

  public deleteProduct(id: string): void {
    const purchaseId =  this.getPurchaseId(id);
    this.purchases.splice(purchaseId, 1);
    this.setTotals();
    this.drawHeader();
    this.setToLocalStorage();
  }

  public getProduct(id: string | null): IProduct {
    const productsArray: IProduct[] = products.filter((element) => element.id === id);
    return JSON.parse(JSON.stringify(productsArray[0]));
  }

  public isInBasket(id: string): boolean {
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

  public drawHeader() {
    const totalSumm = document.querySelector('.header__total') as HTMLElement;
    totalSumm.textContent = `Total amount: ${this.getTotalSumm().toFixed(2)}$`;

    const totalCount = document.querySelector('.cart__amount') as HTMLElement;
    totalCount.textContent = `${this.getTotalCount()}`;
  }

  public setToLocalStorage(): void {
    localStorage.setItem('basket', JSON.stringify(this));
  }
}