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

export { IComponentProps, IRouterProps, IProduct, IRenderProps };
