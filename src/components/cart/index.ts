import Component from '../../common/component';
import Basket from '../../common/basket';
import { IPromo, IProduct, ICart } from '../../common/interface';
import './style-cart.scss';

const validPromo: IPromo[] = [
  {
    promoname: 'NEWYEAR',
    description: 'Happy New Year',
    discount: 23
  },
  {
    promoname: 'RS',
    description: 'Rolling Scopes School',
    discount: 10
  },
  {
    promoname: 'MC',
    description: 'Merry Christmas',
    discount: 7
  },
]

export default class Cart extends Component {
  private basket: Basket;
  private promocodes: IPromo[];
  private cartParams: ICart;

  constructor(name: string) {
    super(name);
    this.basket = new Basket();
    this.promocodes = [];
    const cartSave:string | null = localStorage.getItem('cartParams');
    if (cartSave) {
      this.cartParams = JSON.parse(cartSave);
    } else {
      this.cartParams = {maxItems: 4, currenPage: 1};
    }
  }

  public init(): void {
    console.log('cart');

    const blockProducts = document.querySelector('.cart-products') as HTMLElement;
    blockProducts.style.height = `${Math.min(this.cartParams.maxItems, this.basket.getTotalProducts()) * 100}px`;

    this.draw();
    this.drawSummary();
    this.basket.drawHeader();
    this.initEvents();
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
    const product = this.findNode(target);
    const productId = product?.dataset.id;
    e.stopPropagation();

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
    e.stopPropagation();

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

    this.setPromoTotalSumm();
  }

  private initEvents():void {
    this.handlerPrevPage();
    this.handlerNextPage();
    this.handlerItemsPerPage();
    this.handlerInputPromo();
    this.handlerAddPromo()

    this.handlerChangeCount();
    this.handlerDeleteProduct();
    this.handleBodyClick();
  }

  private handlerChangeCount(): void {
    const btnCount: NodeList = document.querySelectorAll('.ride-button');
    btnCount.forEach((el) => el.addEventListener('click', (event: Event) => this.changeCountProduct(event)));
  }

  private handlerDeleteProduct(): void {
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

  private handlerInputPromo():void {
    const promo = document.querySelector('.cart-summary__promo') as HTMLInputElement;
    promo.addEventListener('input', (e: Event) => this.findPromoCode(e));
  }

  private handlerAddPromo():void {
    const btnAddpromo = document.querySelector('.cart-summary__promo-add') as HTMLButtonElement;
    btnAddpromo.addEventListener('click', () => this.addPromoCode());
  }

  private handlerDelPromo(element: HTMLButtonElement):void {
    element.addEventListener('click', (event: Event) => this.delPromoCode(event));
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
    liSubtotal.textContent = `${(this.basket.getProductCount(product.id) * product.price * 
      (100 - product.discountPercentage) / 100).toFixed(2)}$`;
    
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

  private openProductInfo(event: Event):void {
    const target = event.target as HTMLElement;
    const product = this.findNode(target);
    const productId = product?.dataset.id;

    const url = window.location.href.slice(0, window.location.href.indexOf('#'));

    window.location.href = `${url}#details/${productId}`;
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

  private getPromoCode(name: string): IPromo {
    const index: number = validPromo.findIndex(el => el.promoname === name);
    return validPromo[index];
  }

  private findPromoCode(e: Event): void {
    const target = e.target as HTMLInputElement;
    const index: number = validPromo.findIndex(el => el.promoname === target.value);
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
    this.promocodes.push(this.getPromoCode(promoName.value));
    this.drawPromoCodes();
    promoName.value = '';
    promoName.dispatchEvent(new Event('input', { bubbles: true }));
  }

  private delPromoCode(e: Event):void {
    const target = e.target as HTMLElement;
    const liItem = target.parentNode as HTMLElement;
    const codeName = liItem.dataset.promoname;
    
    if (codeName) {
      const index = this.getPromoCodesIndex(codeName);
      this.promocodes.splice(index, 1);
      liItem?.parentNode?.removeChild(liItem);
      this.drawPromoCodes();
    }
  }

  private drawPromoCodes(): void {
    const promoBlock = document.querySelector('.cart-summary__promocodes') as HTMLElement;
    const promoItems = document.querySelector('.cart-summary__promo-items') as HTMLElement;
    const promoTotal = document.querySelector('.cart-summary__total-promo') as HTMLElement;
    promoItems.innerHTML = '';
    if (this.promocodes.length > 0) {
      this.promocodes.forEach((element: IPromo) => {
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
    if (this.promocodes.length > 0) {
      this.promocodes.forEach((element: IPromo) => {
        promoSumm = Math.round((prevSumm * (100 - element.discount) / 100) * 100) / 100;
        prevSumm = promoSumm;
      });
      promoTotalSumm.textContent = `${totalSumm.toFixed(2)}$`;
      summaryTotalSumm.textContent = `${promoSumm.toFixed(2)}$`;
    } else {
      summaryTotalSumm.textContent = `${totalSumm.toFixed(2)}$`;
    }
  }

  private getPromoCodesIndex(name: string): number {
    let result = -1;
    for (let i = 0; i < this.promocodes.length; i++) {
      if (this.promocodes[i].promoname === name) {
        result = i;
      }
    }
    return result;
  }

  public setToLocalStorage(): void {
    localStorage.setItem('cartParams', JSON.stringify(this.cartParams));
  }

  private handleBodyClick() {
    document.body.addEventListener('click', (e) => {
      const target = e.target as HTMLDivElement;
      const targetParent = target.offsetParent;
      const modal = document.querySelector('.modal') as HTMLElement;

      if (
        target.className !== 'modal' &&
        targetParent?.className !== 'modal' &&
        target.className !== 'cart-summary__submit'
      ) {
        modal.style.display = 'none';
        document.body.classList.remove('shadow');
      }
    });
  }

  private callPopup() {
    const body = document.body;
    const modal = document.querySelector('.modal') as HTMLDivElement;

    body.classList.add('shadow');

    if (modal) {
      modal.style.display = 'block';
      modal.addEventListener('click', (e) => this.handleModal(e));
    }
  }

  handleModal(e: Event) {
    const target = e.target as HTMLElement;

    // добавить валидацию
  }
}