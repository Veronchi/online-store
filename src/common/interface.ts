import { Routes } from './router';

interface IComponentProps {
  name: string;
}

interface IRouterProps {
  routes: Array<Routes>;
  root: string;
}

interface IProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

interface IRenderProps {
  rootElement: string;
}

interface IPurchase {
  count: number;
  product: IProduct;
}

interface ICart {
  maxItems: number;
}

interface IPromo {
  promoname: string;
  description: string;
  discount: number;
}

export { IComponentProps, IRouterProps, IProduct, IRenderProps, IPurchase, IPromo, ICart };
