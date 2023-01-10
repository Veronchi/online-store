import Component from '../../common/component';
import Basket from '../../common/basket';
import { IProduct, ICart, IPromo } from '../../common/interface';
import { validPromo } from '../../common/basket';
import './style-cart.scss';


export default class Cart extends Component {
  private basket: Basket;
  
  private cartParams: ICart;

  constructor(name: string) {
    super(name);
    this.basket = new Basket();
    const cartSave:string | null = localStorage.getItem('cartParams');
    if (cartSave) {
      this.cartParams = JSON.parse(cartSave);
    } else {
      this.cartParams = { maxItems: 4, currenPage: 1 };
    }
  }

  public init(): void {
    console.log('cart');

    const url = new URL(window.location.href);

    this.basket.init();

    const blockProducts = document.querySelector('.cart-products') as HTMLElement;
    blockProducts.style.height = `${Math.min(this.cartParams.maxItems, this.basket.getTotalProducts()) * 100}px`;

    this.draw();
    this.drawPromoCodes();
    this.drawSummary();
    this.basket.drawHeader();
    this.initEvents();

    if (url.hash === '#cart?buy=1') {
      this.callModal();
    }
  }

  public draw(): void {
    const cartProducts = document.querySelector('.cart-products') as HTMLElement;
    cartProducts.innerHTML = '';

    const cartInput = document.querySelector('.cart-pagination__input') as HTMLInputElement;
    cartInput.value = `${this.cartParams.maxItems}`;

    if (this.basket.purchases.length > 0) {
      this.changePage(this.cartParams.currenPage);
    } else {
      const cartProducts = document.querySelector('.cart-container') as HTMLElement;
      cartProducts.innerHTML = '';

      const cartEl = this.createEmptyCart();
      cartProducts.append(cartEl);
    }
  }

  private changeCountProduct(e: Event): void {
    const target = e.target as HTMLElement;
    const product = this.findNode(target) as HTMLElement;
    const productId = product.dataset.id;
    e.stopPropagation();

    if (productId) {
      const newCount = this.basket.changeProductCount(productId, String(target.textContent));

      if (newCount > 0) {
        const searchBlock = target.parentElement?.parentElement as HTMLElement;
        const productCount = searchBlock.querySelector('.cart-products__quantity-count') as HTMLElement;
        productCount.textContent = `${newCount}`;

        const searchTotal = target.parentElement?.parentElement?.parentElement as HTMLElement;
        const subTotal = searchTotal.querySelector('.cart-products__subtotal') as HTMLElement;
        subTotal.textContent = `${(
          (newCount *
            this.basket.getProduct(productId).price *
            (100 - this.basket.getProduct(productId).discountPercentage)) /
          100
        ).toFixed(2)}$`;
      } else {
        const currentPage = Number(document.querySelector('.cart-pagination__count')?.textContent);
        this.changePage(Math.min(currentPage, this.getNumPages()));
      }
      this.drawSummary();
    }
  }

  private deleteProduct(e: Event): void {
    const target = e.target as HTMLElement;
    const product = this.findNode(target)  as HTMLElement;
    const productId = product.dataset.id;
    e.stopPropagation();

    if (productId) {
      const currentPage = Number(document.querySelector('.cart-pagination__count')?.textContent);
      this.basket.deleteProduct(productId);
      this.changePage(Math.min(currentPage, this.getNumPages()));
      this.drawSummary();
    }
  }

  private drawSummary() {
    if (this.basket.purchases.length !== 0) {
      const countProducts = document.querySelector('.cart-summary__products-count') as HTMLElement;
      countProducts.textContent = `${this.basket.getTotalCount()}`;

      const countDiscount = document.querySelector('.cart-summary__discount-count') as HTMLElement;
      countDiscount.textContent = `${this.basket.getTotalDiscount().toFixed(2)}$`;

      const countSumm = document.querySelector('.cart-summary__total-count') as HTMLElement;
      countSumm.textContent = `${this.basket.getTotalSumm().toFixed(2)}$`;

      this.setPromoTotalSumm();
    }
  }

  private initEvents():void {
    if (this.basket.purchases.length !== 0) {
      this.handlerPrevPage();
      this.handlerNextPage();
      this.handlerItemsPerPage();
      this.handlerInputPromo();
      this.handlerAddPromo()
      this.handlerBuyNow();

      this.handleBodyClick();
      this.handleCartSummmaryClick();
      this.handleModalEvent();
      this.handleSubmitBtn();
    }
  }

  private handlerChangeCount(): void {
    const btnCount: NodeList = document.querySelectorAll('.ride-button');
    btnCount.forEach((el) => el.addEventListener('click', (event: Event) => this.changeCountProduct(event)));
  }

  private handlerDeleteProduct(): void {
    const btnCount: NodeList = document.querySelectorAll('.cart-products__delete');
    btnCount.forEach((el) => el.addEventListener('click', (event: Event) => this.deleteProduct(event)));
  }

  private handlerPrevPage(): void {
    const btnPrev = document.querySelector('.cart-pagination__left') as HTMLButtonElement;
    btnPrev.addEventListener('click', () => this.prevPage());
  }

  private handlerNextPage(): void {
    const btnNext = document.querySelector('.cart-pagination__right') as HTMLButtonElement;
    btnNext.addEventListener('click', () => this.nextPage());
  }

  private handlerItemsPerPage(): void {
    const btnNext = document.querySelector('.cart-pagination__input') as HTMLButtonElement;
    btnNext.addEventListener('input', () => this.changeItemsPerPage());
  }

  private handlerInputPromo(): void {
    const promo = document.querySelector('.cart-summary__promo') as HTMLInputElement;
    promo.addEventListener('input', (e: Event) => this.findPromoCode(e));
  }

  private handlerAddPromo(): void {
    const btnAddpromo = document.querySelector('.cart-summary__promo-add') as HTMLButtonElement;
    btnAddpromo.addEventListener('click', () => this.addPromoCode());
  }

  private handlerDelPromo(element: HTMLButtonElement): void {
    element.addEventListener('click', (event: Event) => this.delPromoCode(event));
  }

  private handlerBuyNow():void {
    const btnBuy = document.querySelector('.cart-summary__submit') as HTMLButtonElement;
    btnBuy.addEventListener('click', () => this.callModal());
  }
  
  private handleBodyClick(): void {
    document.body.addEventListener('click', (e) => this.handleBody(e));
  }

  private handleCartSummmaryClick(): void {
    const summaryBtn = document.querySelector('.cart-summary__submit') as HTMLButtonElement;

    summaryBtn.addEventListener('click', this.callModal);
  }

  private handleModalEvent(): void {
    const modal = document.querySelector('.modal') as HTMLDivElement;

    modal.addEventListener('input', (e) => this.handleModal(e as InputEvent));
  }

  private handleSubmitBtn() {
    const btn = document.querySelector('.modal__submit');

    btn?.addEventListener('click', (e) => this.submitForm(e));
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
    liNum.textContent = `${this.basket.getProductPosition(product.id) + 1}`;
    liDesc.textContent = product.description;
    liPrice.textContent = `${product.price.toFixed(2)}$`;
    liDiscount.textContent = `${product.discountPercentage}%`;
    img.src = product.thumbnail;
    img.alt = `${product.title}`;
    count.textContent = `${this.basket.getProductCount(product.id)}`;
    stock.textContent = `Stock: ${product.stock}`;
    btnPlus.textContent = '+';
    btnMinus.textContent = '-';
    liSubtotal.textContent = `${(
      (this.basket.getProductCount(product.id) * product.price * (100 - product.discountPercentage)) /
      100
    ).toFixed(2)}$`;

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

    ul.addEventListener('click', (event: Event) => this.openProductInfo(event));

    return ul;
  }

  private openProductInfo(event: Event): void {
    const target = event.target as HTMLElement;
    const product = this.findNode(target)  as HTMLElement;
    const productId = product.dataset.id;

    localStorage.setItem('productId', `${productId}`);

    const url = window.location.href.slice(0, window.location.href.indexOf('#'));
    window.location.href = `${url}#details/${productId}`;

    // const url = new URL(window.location.href);
    // const newUrl = `${url.origin}/#details/${this.id}`
    // window.history.pushState({path: newUrl}, '', newUrl);
  }

  private createEmptyCart(): HTMLElement {
    const emptyCArt = document.createElement('p');
    emptyCArt.className = 'cart-products__empty';
    emptyCArt.textContent = 'Cart is Empty';
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
    const countPage = document.querySelector('.cart-pagination__count') as HTMLElement;
    let currentPage = Number(countPage.textContent);
    if (currentPage > 1) {
      currentPage--;
      this.changePage(currentPage);
    }
  }

  private nextPage(): void {
    const countPage = document.querySelector('.cart-pagination__count') as HTMLElement;
    let currentPage = Number(countPage.textContent);
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

    if (this.basket.purchases.length !== 0) {
      for (let i = (page - 1) * itemPerPage; i < page * itemPerPage && i < this.basket.purchases.length; i++) {
        const cartEl = this.createCartProduct(this.basket.purchases[i].product);
        cartProducts.append(cartEl);
      }

      if (page === 1) {
        prevPage.style.visibility = 'hidden';
      } else {
        prevPage.style.visibility = 'visible';
      }

      if (page === this.getNumPages()) {
        nextPage.style.visibility = 'hidden';
      } else {
        nextPage.style.visibility = 'visible';
      }

      this.cartParams.currenPage = page;

      this.handlerChangeCount();
      this.handlerDeleteProduct();
    } else {
      const cartProducts = document.querySelector('.cart-container') as HTMLElement;
      cartProducts.innerHTML = '';

      const cartEl = this.createEmptyCart();
      cartProducts.append(cartEl);
    }

    const url = new URL(window.location.href);
    const newUrl = `${url.origin}/#cart${this.getQueryParamNumPage(page)}`
    window.history.pushState({path: newUrl}, '', newUrl);

    this.setToLocalStorage();
  }

  private changeItemsPerPage(): void {
    const maxItem = document.querySelector('.cart-pagination__input') as HTMLInputElement;
    const itemPerPage = Number(maxItem.value);

    const blockProducts = document.querySelector('.cart-products') as HTMLElement;
    blockProducts.style.height = `${Math.min(itemPerPage, this.basket.getTotalProducts()) * 100}px`;

    const pageCount = document.querySelector('.cart-pagination__count') as HTMLElement;
    const curPage = Number(pageCount.textContent);

    if (curPage > this.getNumPages()) {
      this.changePage(this.getNumPages());
    } else {
      this.changePage(curPage);
    }

    this.cartParams.maxItems = itemPerPage;
    this.setToLocalStorage();
  }

  private getNumPages(): number {
    const maxItem = document.querySelector('.cart-pagination__input') as HTMLInputElement;
    return Math.ceil(this.basket.purchases.length / Number(maxItem.value));
  }

  private getQueryParamNumPage(page: number): string {
    return `?page=${page}`;
  }

  private findPromoCode(e: Event): void {
    const target = e.target as HTMLInputElement;
    const index: number = validPromo.findIndex((el) => el.promoname === target.value);
    const promoFind = document.querySelector('.cart-summary__promo-find') as HTMLElement;
    if (index >= 0) {
      const promoDesc = document.querySelector('.cart-summary__promo-desc') as HTMLElement;
      promoDesc.textContent = `${validPromo[index].description} - ${validPromo[index].discount}%`;
      promoFind.style.display = 'block';
    } else {
      promoFind.style.display = 'none';
    }
  }

  private addPromoCode(): void {
    const promoName = document.querySelector('.cart-summary__promo') as HTMLInputElement;
    this.basket.addPromoCode(promoName.value);
    this.drawPromoCodes();
    promoName.value = '';
    promoName.dispatchEvent(new Event('input', { bubbles: true }));
  }

  private delPromoCode(e: Event): void {
    const target = e.target as HTMLElement;
    const liItem = target.parentNode as HTMLElement;
    const codeName = liItem.dataset.promoname;

    if (codeName) {
      this.basket.deletePromoCode(codeName);
      liItem?.parentNode?.removeChild(liItem);
      this.drawPromoCodes();
    }
  }

  private drawPromoCodes(): void {
    const promoBlock = document.querySelector('.cart-summary__promocodes') as HTMLElement;
    const promoItems = document.querySelector('.cart-summary__promo-items') as HTMLElement;
    const promoTotal = document.querySelector('.cart-summary__total-promo') as HTMLElement;
    promoItems.innerHTML = '';
    if (this.basket.promocodes.length > 0) {
      this.basket.promocodes.forEach((element: IPromo) => {
        const liItem = document.createElement('li');
        const liDrop = document.createElement('button');
        liItem.className = 'cart-summary__promo-item';
        liItem.textContent = `${element.description} - ${element.discount}%`;
        liItem.setAttribute('data-promoname', element.promoname);
        liDrop.className = 'cart-summary__promo-drop';
        liDrop.textContent = 'X';
        liItem.append(liDrop);
        promoItems.append(liItem);
        promoBlock.style.display = 'block';
        promoTotal.style.display = 'block';
        this.handlerDelPromo(liDrop);
      });
    } else {
      promoBlock.style.display = 'none';
      promoTotal.style.display = 'none';
    }
    this.setPromoTotalSumm();
  }

  private setPromoTotalSumm() {
    const promoTotalSumm = document.querySelector('.cart-summary__total-count-promo') as HTMLElement;
    const summaryTotalSumm = document.querySelector('.cart-summary__total-count') as HTMLElement;

    let promoSumm = 0;
    const totalSumm = this.basket.getTotalSumm();
    let prevSumm = totalSumm;
    if (this.basket.promocodes.length > 0) {
      this.basket.promocodes.forEach((element: IPromo) => {
        promoSumm = Math.round((prevSumm * (100 - element.discount) / 100) * 100) / 100;
        prevSumm = promoSumm;
      });
      promoTotalSumm.textContent = `${totalSumm.toFixed(2)}$`;
      summaryTotalSumm.textContent = `${promoSumm.toFixed(2)}$`;
    } else {
      summaryTotalSumm.textContent = `${totalSumm.toFixed(2)}$`;
    }
  }

  public setToLocalStorage(): void {
    localStorage.setItem('cartParams', JSON.stringify(this.cartParams));
  }

  private handleBody(e: Event): void {
    const target = e.target as HTMLDivElement;
    const modal = document.querySelector('.modal') as HTMLElement;

    if (target.className.includes('shadow')) {
      modal.style.display = 'none';
      document.body.classList.remove('shadow');
    }
  }

  private callModal() {
    const modal = document.querySelector('.modal') as HTMLDivElement;
    document.body.classList.add('shadow');

    modal.style.display = 'block';
  }

  private handleModal(e: InputEvent): void {
    const target = e.target as HTMLInputElement;
    const errorStyles = `border: 1px solid red; box-shadow: 0px 2px 9px red; outline-color: red;`;

    switch (target.name) {
      case 'user-name':
        this.validateNameInput(target as HTMLInputElement, errorStyles);
        break;
      case 'user-phone':
        this.validatePhoneInput(target as HTMLInputElement, errorStyles);
        break;
      case 'user-adress':
        this.validateAdressInput(target as HTMLInputElement, errorStyles);
        break;
      case 'user-mail':
        this.validateMailInput(target as HTMLInputElement, errorStyles);
        break;
      case 'credit-num':
        this.validateCreditNumInput(target as HTMLInputElement, errorStyles);
        break;
      case 'credit-date':
        this.validateDateInput(target as HTMLInputElement, errorStyles);
        break;
      case 'credit-cvv':
        this.validateCvvInput(target as HTMLInputElement, errorStyles);
        break;
      default:
        break;
    }
  }

  private validateNameInput(target: HTMLInputElement, errorStyle: string) {
    const inputName = target.value;
    const errorText = document.querySelector('.error-name') as HTMLSpanElement;

    const inputArr = inputName?.split(' ') as Array<string>;

    if (inputName) {
      if (~inputName.search(/[^a-z,A-Z,\s]+/gm)) {
        target.style.cssText = errorStyle;
        errorText.classList.add('visible');
      } else if (inputArr.length !== 2) {
        errorText.classList.add('visible');
        target.style.cssText = errorStyle;
        errorText.classList.add('visible');
      } else if (inputArr.find((str) => str.length < 3)) {
        errorText.classList.add('visible');
        target.style.cssText = errorStyle;
      } else if (inputArr.includes('')) {
        errorText.classList.add('visible');
        target.style.cssText = errorStyle;
      } else if (inputArr.find((item) => item[0].search(/[A-Z]/))) {
        errorText.classList.add('visible');
        target.style.cssText = errorStyle;
      } else {
        target.style.cssText = ``;
        errorText.classList.remove('visible');
      }
    }
  }

  private validatePhoneInput(target: HTMLInputElement, errorStyle: string) {
    const inputValue = target.value;
    const errorText = document.querySelector('.error-phone') as HTMLSpanElement;

    if (inputValue) {
      if (inputValue.length < 9) {
        errorText.classList.add('visible');
        target.style.cssText = errorStyle;
      } else if (!/^\+\d{9,}/i.test(inputValue)) {
        target.style.cssText = errorStyle;
        errorText.classList.add('visible');
      } else {
        target.style.cssText = ``;
        errorText.classList.remove('visible');
      }
    }
  }

  private validateAdressInput(target: HTMLInputElement, errorStyle: string) {
    const inputValue = target.value;
    const inputArr = inputValue?.split(' ') as Array<string>;
    const errorText = document.querySelector('.error-adress') as HTMLSpanElement;

    if (inputValue) {
      if (~inputValue.search(/[^a-z,A-Z,\s,0-9]+/gm)) {
        target.style.cssText = errorStyle;
        errorText.classList.add('visible');
      } else if (inputArr.length !== 3) {
        target.style.cssText = errorStyle;
        errorText.classList.add('visible');
      } else if (inputArr.find((str) => str.length < 5)) {
        target.style.cssText = errorStyle;
        errorText.classList.add('visible');
      } else if (inputArr.includes('')) {
        target.style.cssText = errorStyle;
        errorText.classList.add('visible');
      } else {
        target.style.cssText = ``;
        errorText.classList.remove('visible');
      }
    }
  }

  private validateMailInput(target: HTMLInputElement, errorStyle: string) {
    const inputValue = target.value;
    const errorText = document.querySelector('.error-mail') as HTMLSpanElement;

    if (inputValue) {
      if (!~inputValue.search(/^[\w|\d]+@\w+\.\w+/gm)) {
        target.style.cssText = errorStyle;
        errorText.classList.add('visible');
      } else {
        target.style.cssText = ``;
        errorText.classList.remove('visible');
      }
    }
  }

  private validateCreditNumInput(target: HTMLInputElement, errorStyle: string) {
    const inputValue = target.value;
    const errorText = document.querySelector('.error-cart') as HTMLSpanElement;

    if (~inputValue.search(/[^\d,\s]/gm)) {
      target.style.cssText = errorStyle;
      errorText.classList.add('visible');
    } else if (inputValue.length < 19) {
      target.style.cssText = errorStyle;
      errorText.classList.add('visible');
    } else {
      target.style.cssText = ``;
      errorText.classList.remove('visible');
    }

    let value = target.value.replace(/[^\d]/g, '').substring(0, 16);
    value = value !== '' ? (value.match(/.{1,4}/g)?.join(' ') as string) : '';
    target.value = value;
  }

  private validateDateInput(target: HTMLInputElement, errorStyle: string) {
    const inputValue = target.value;
    const errorText = document.querySelector('.error-date') as HTMLSpanElement;

    if (~inputValue.search(/[^\d,\s,//]/gm)) {
      target.style.cssText = errorStyle;
      errorText.classList.add('visible');
    } else if (inputValue.length < 4) {
      target.style.cssText = errorStyle;
      errorText.classList.add('visible');
    } else {
      target.style.cssText = ``;
      errorText.classList.remove('visible');
    }

    let value = target.value.replace(/[^0-9]/g, '').substring(0, 4);
    value = value !== '' ? (value.match(/.{1,2}/g)?.join(' / ') as string) : '';
    target.value = value;

    if (+target.value.slice(0, 2) > 12) {
      target.style.cssText = errorStyle;
      errorText.classList.add('visible');
    }
  }

  private validateCvvInput(target: HTMLInputElement, errorStyle: string) {
    const value = target.value.replace(/[^0-9]/g, '').substring(0, 4);
    const errorText = document.querySelector('.error-cvv') as HTMLSpanElement;

    if (value.length < 3) {
      target.style.cssText = errorStyle;
      errorText.classList.add('visible');
    } else {
      target.style.cssText = ``;
      errorText.classList.remove('visible');
    }

    target.value = value;
  }

  private submitForm(e: Event) {
    e.preventDefault();
    let count = 0;

    const form = document.getElementById('modal-form') as HTMLFormElement;
    const popup = document.querySelector('.popup') as HTMLDivElement;

    const name = document.querySelector('.person-info__input_name') as HTMLInputElement;
    const number = document.querySelector('.person-info__input_number') as HTMLInputElement;
    const adress = document.querySelector('.person-info__input_adress') as HTMLInputElement;
    const email = document.querySelector('.person-info__input_email') as HTMLInputElement;
    const credit = document.querySelector('.credit__input_number') as HTMLInputElement;
    const date = document.querySelector('.credit__input_date') as HTMLInputElement;
    const cvv = document.querySelector('.credit__input_cvv') as HTMLInputElement;

    if (name.value.length > 6) {
      count += 1;
    } else {
      name.nextElementSibling?.classList.add('visible');
    }

    if (number.value.length > 9) {
      count += 1;
    } else {
      number.nextElementSibling?.classList.add('visible');
    }

    if (adress.value.length > 17) {
      count += 1;
    } else {
      adress.nextElementSibling?.classList.add('visible');
    }

    if (email.value.includes('@')) {
      count += 1;
    } else {
      email.nextElementSibling?.classList.add('visible');
    }

    if (credit.value.length > 16) {
      count += 1;
    } else {
      credit.nextElementSibling?.classList.add('visible');
    }

    if (date.value.length > 4) {
      count += 1;
    } else {
      date.nextElementSibling?.classList.add('visible');
    }

    if (cvv.value.length === 3) {
      count += 1;
    } else {
      cvv.nextElementSibling?.classList.add('visible');
    }

    if (count === 7) {
      form.style.display = 'none';
      popup.style.display = 'flex';

      setTimeout(() => {
        document.body.classList.remove('shadow');
        localStorage.removeItem('basket');
        const url = window.location.href.slice(0, window.location.href.indexOf('#'));
        window.location.href = `${url}#`;
      }, 3000);
    }
  }
}
