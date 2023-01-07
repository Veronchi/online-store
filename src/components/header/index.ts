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

  private setAmount(value: number) {
    if (value === -1) {
      this.cartAmount = 0;
    } else {
      this.cartAmount += value;
    }
  }

  private changeCartAmount(): void {
    const cartAmount = document.querySelector('cart__amount');

    cartAmount ? (cartAmount.innerHTML = `${this.amount}`) : null;
  }

  public addToCart() {
    // console.log(11111);
    this.setAmount(1);
  }
}
