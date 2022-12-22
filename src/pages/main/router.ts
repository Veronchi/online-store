export default class Router {
  private url: URL;
  private searchParams: URLSearchParams;
  private root: HTMLElement | null;
  private routes = {
    '/': '',
  };

  constructor() {
    this.url = new URL(window.location.href);
    this.searchParams = new URLSearchParams(this.url.search);
    this.root = document.getElementById('root');
  }

  appendParam(key: string, value: string) {
    this.searchParams.set(key, value);
    window.location.search = this.searchParams.toString();
    // window.history.pushState(null, '', xx);
  }

  getParseQueryParam() {
    // for (const key of this.searchParams.keys(): IterableIterator<string>) {
    //   console.log(key);
    // }
    // debugger;
  }

  navTo(pathname: string) {
    window.history.pushState({}, pathname, window.location.origin + pathname);
    if (this.root) {
      this.root.innerHTML = this.routes[pathname as keyof typeof this.routes];
    }
  }
}
