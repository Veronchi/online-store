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

interface IBasket {
  purchases: IPurchase[];
  totalSumm: number;
  totalCount: number;
}
interface IFilterProduct {
  name: string;
  stock: number;
}

interface IFilterAmount {
  from: number;
  to: number;
}

interface IFilterRootElement {
  root: string;
}

type MapRootElements = {
  [n: string]: HTMLElement;
};

interface IFilterInitValues {
  lists: Array<IFilterRootElement>;
  ranges: Array<IFilterRootElement>;
}

interface IFilterMapElements {
  lists: MapRootElements;
  ranges: MapRootElements;
}

type TQParams = {
  [n: string]: string;
};

export {
  IComponentProps,
  IRouterProps,
  IProduct,
  IRenderProps,
  IFilterProduct,
  IFilterAmount,
  IFilterInitValues,
  IFilterRootElement,
  IFilterMapElements,
  MapRootElements,
  IPurchase,
  IBasket,
  TQParams,
};
