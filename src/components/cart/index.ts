import Component from '../../common/component';
import { IProduct, IPurchase, IBasket } from '../../common/interface';
import { products} from '../../products';
import './style-cart.scss';



export default class Cart extends Component {

  constructor(name: string) {
    super(name);
  }

  init() {
    console.log('cart');
    const btn = document.querySelector('.cart-summary__submit') as HTMLElement;
    btn.addEventListener('click', () => basket.addProducts());
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

  init() {
    console.log(this.purchases);
  }

  public addProducts(): void {
    const id: string | null = localStorage.getItem('productId');
    if (id) {
      this.purchases.push({count: 1, product: this.getProduct(id)});
      this.setToLocalStorage();
    }
  }

  private getProduct(id: string | null): IProduct {
    const productsArray: IProduct[] = products.filter((element) => element.id === id);
    return JSON.parse(JSON.stringify(productsArray[0]));
  }

  setToLocalStorage(): void {
    localStorage.setItem('basket', JSON.stringify(this));
  }

}

const basket = new Basket();
basket.init();

