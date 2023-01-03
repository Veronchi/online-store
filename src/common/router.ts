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

  public initRoutes(routes: Array<Routes>): void {
    this.routes = routes;
    this.initialize();
    this.hashChanged();
  }

  public appendParam(key: string, value: string, removeKey?: string, removeValue?: string): void {
    let search = window.location.search;
    if (search[0] === '?') search = search.slice(1);

    const array = search.split('&');
    if (array[0] === '') array.length = 0;

    const deletedparams = `${removeKey}=${removeValue}`;
    const params = `${key}=${value}`;

    const deletedIndex = array.indexOf(deletedparams);
    if (deletedIndex >= 0) array.splice(deletedIndex, 1);

    if (!array.includes(params)) array.push(params);

    this.url.search = array.join('&');
    history.pushState(null, '', this.url.href);
  }

  private initialize(): void {
    window.addEventListener('hashchange', this.hashChanged.bind(this));
  }

  private hashChanged(): void {
    for (let i = 0; i < this.routes.length; i++) {
      const route = this.routes[i];

      if (route.isActiveRoute()) {
        this.navigate(route.component);
      }
    }
  }

  private navigate(component: Component): void {
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
  public isActiveRoute(): boolean {
    const locationHash = window.location.hash;
    const path: Array<string> | null = locationHash.match(/#(\w+)/);
    const pathName: string = path ? path[1] : '';

    return pathName === this.component.getName() || this.defaultRoute;
  }
}
