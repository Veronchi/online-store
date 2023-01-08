import Component from '../../common/component';
import './style.scss';

export default class Header extends Component {
  private cartAmount: number;

  constructor(name: string) {
    super(name);
    this.cartAmount = 0;
  }

  public init(): void {
    this.changeCartAmount();
  }

  private get amount(): number {
    return this.cartAmount;
  }

  private setAmount(value?: number) {
    if (value === -1) {
      this.cartAmount -= 1;
    } else {
      this.cartAmount += 1;
    }
  }

  private changeCartAmount(): void {
    const cartAmount = document.querySelector('.cart__amount');

    cartAmount ? (cartAmount.innerHTML = `${this.amount}`) : null;
  }

  public addToCart() {
    this.cartAmount += 1;
    this.changeCartAmount();
  }

  public removeFromCart() {
    this.cartAmount -= 1;
    this.changeCartAmount();
  }
}
