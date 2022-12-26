import Component from '../../common/component';
import './style-details.scss';

export default class Details extends Component {
  constructor(name: string) {
    super(name);
  }

  init() {
    console.log('details');
  }
}
