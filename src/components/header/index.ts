import Component from '../../common/component';
import './style.scss';

export default class Header extends Component {
  constructor(name: string) {
    super(name);
  }

  public init(): void {
    console.log('header');
  }
}
