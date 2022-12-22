import Router from './router';

export default class RouterProducts extends Router {
  constructor() {
    super();
  }

  onChangeProductLayout(btnWrapper: HTMLDivElement) {
    const collection: HTMLCollection = btnWrapper.children;
    const btnArr = Array.from(collection);
    const active = btnArr.find((btn) => btn.className.includes('layout__btn_active'));

    if (active && active.className.includes('layout__btn_row')) {
      this.appendParam('productLayout', 'row');
    } else {
      this.appendParam('productLayout', 'grid');
    }
  }
}
