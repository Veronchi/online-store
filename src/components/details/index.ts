import Component from '../../common/component';
import './style-details.scss';
import { IProduct } from '../../common/interface';
import { products} from '../../products';

export default class Details extends Component {
  private product: IProduct | null;

  constructor(name: string) {
    super(name);
    this.product = null;
  }

  init() {
    console.log('details');
    this.draw();
    this.initEvents();
  }

  draw():void {
    const id: string | null = localStorage.getItem('productId');
    const arr: IProduct[] = products.filter((element) => element.id === id);
    this.product = arr[0];

    const detailsClone = document;
    
    const detailsCost = detailsClone.querySelector('.details__cost') as HTMLElement;
    detailsCost.textContent = `Cost: ${String(this.product.price)}$`;

    const descriptionCategory = detailsClone.querySelector('.description__category') as HTMLElement;
    descriptionCategory.textContent = this.product.category;

    const descriptionBrand = detailsClone.querySelector('.description__brand') as HTMLElement;
    descriptionBrand.textContent = this.product.brand;
    
    const descriptionTitle = detailsClone.querySelector('.description__title') as HTMLElement;
    descriptionTitle.textContent = this.product.title;
    
    const descriptionProduct: string[] = ['description', 'category', 'brand', 'rating', 'stock'];

    const descriptionBlock = detailsClone.querySelector('.description') as HTMLElement;

    descriptionProduct.forEach((element: string) => {
      const block = document.createElement('div');
      block.className = 'description__item';

      const head = document.createElement('h3');
      head.className = 'description__caption';
      head.textContent = element[0].toUpperCase() + element.slice(- element.length + 1) + ':';

      block.append(head);

      const info = document.createElement('p');
      info.className = 'description__info';
      info.textContent = (this.product === null) ? '' : String(this.product[element as keyof IProduct]);
      
      block.append(info);

      descriptionBlock.append(block);
    });

    // const btnAddCart = document.querySelector('.details__cart') as HTMLButtonElement;
    // if (basket.isInBasket(id)) {
    //   btnAddCart.textContent = 'Drop from Cart';
    // } else {
    //   btnAddCart.textContent = 'Add in Cart';
    // }

    const detailsDiscount = detailsClone.querySelector('.details__discount') as HTMLElement;
    detailsDiscount.textContent = `Sale ${String(this.product.discountPercentage)}%`;
    if (this.product.discountPercentage === 0) detailsDiscount.style.visibility = 'hidden';

    const detailsImage = detailsClone.querySelector('.details__image') as HTMLElement;
    detailsImage.style.backgroundImage = `url("${ this.product.thumbnail}")`;

    const detailsThumbnails = detailsClone.querySelector('.details__thumbnails') as HTMLElement;
    
    const imagesArray: string[] = [this.product.thumbnail].concat(this.product.images);

    imagesArray.forEach((element: string, idx: number) => {
      const thumbnail = document.createElement('div') as HTMLElement;
      thumbnail.className = 'details__thumbnail';
      thumbnail.style.backgroundImage = `url("${element}")`;
      if (idx === 0) thumbnail.classList.add('details__thumbnail_checked');
      detailsThumbnails.append(thumbnail);
    })

  }

  private initEvents():void {
    this.handlerProductImage();
    this.handlerAddCart();
  }
  
  private handlerProductImage():void {
    const tubnails: NodeList = document.querySelectorAll('.details__thumbnail');
    tubnails.forEach((el) => el.addEventListener('click', this.onChangeImage));
  }

  private handlerAddCart():void {
    const btnCart = document.querySelector('.details__cart') as HTMLButtonElement;
    btnCart.addEventListener('click', this.addProductToCart)
  }

  private addProductToCart() {
    // basket.addProducts();
    console.log('Add product')
  }

  private onChangeImage(e: Event):void {
    const targetElement = e.target as Element;
    const imageSource = document.querySelector('.details__image') as HTMLElement;

    const imageStyles = window.getComputedStyle(targetElement).backgroundImage;
    imageSource.style.backgroundImage = `${imageStyles}`;

    const checkedImage = document.querySelector('.details__thumbnail_checked') as HTMLElement;
    checkedImage.classList.toggle('details__thumbnail_checked');
    targetElement.classList.add('details__thumbnail_checked');
  }

  // buyNow() {

  // }
}