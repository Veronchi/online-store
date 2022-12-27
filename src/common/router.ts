import Component from './component';

export class Router {
  private url: URL;
  private searchParams: URLSearchParams;
  routes: Array<Routes>;
  routeElement: HTMLElement | null;

  constructor(root: string) {
    this.url = new URL(window.location.href);
    this.searchParams = new URLSearchParams(this.url.search);
    this.routeElement = document.getElementById(root);
    this.routes = [];
  }

  initRoutes(routes: Array<Routes>) {
    this.routes = routes;
    this.initialize();
    this.hashChanged();
  }

  public appendParam(key: string, value: string) {
    const locationHash = window.location.hash;
    const path: Array<string> | null = locationHash.match(/(#\w+)/);
    const pathName: string = path ? path[1] : '';
    window.history.pushState(null, '', `${pathName}?${key}=${value}`);
  }

  public deleteParam(key: string): void {
    if (this.searchParams.has(key)) {
      this.searchParams.delete(key);
    }
  }

  initialize() {
    window.addEventListener('hashchange', this.hashChanged.bind(this));
  }

  hashChanged() {
    for (let i = 0; i < this.routes.length; i++) {
      const route = this.routes[i];
      if (route.isActiveRoute()) {
        this.navigate(route.component);
      }
    }
  }

  navigate(component: Component) {
    fetch(component.getURLPath()).then(async (data) => {
      const html = await data.text();
      const element: HTMLElement | null = this.routeElement;
      if (element) element.innerHTML = html;
      component.init();
    });
  }
}

export class Routes {
  component: Component;
  defaultRoute: boolean;

  constructor(component: Component, defaultRoute: boolean) {
    this.component = component;
    this.defaultRoute = defaultRoute;
  }
  isActiveRoute() {
    const locationHash = window.location.hash;
    const path: Array<string> | null = locationHash.match(/#(\w+)/);
    const pathName: string = path ? path[1] : '';
    return pathName === this.component.getName() || this.defaultRoute;
  }
}
