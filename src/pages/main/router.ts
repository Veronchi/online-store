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

  public appendParam(key: string, value: string) {
    window.history.pushState(null, '', `?${key}=${value}`);
    // window.history.replaceState(null, '', `?${key}=${value}`);

    // this.searchParams.append(key, value);

    // window.location.search = this.searchParams.toString();
  }

  public deleteParam(key: string): void {
    if (this.searchParams.has(key)) {
      this.searchParams.delete(key);
    }
  }

  getParseQueryParam() {
    // for (const key of this.searchParams.keys(): IterableIterator<string>) {
    //   console.log(key);
    // }
    // debugger;
  }

  // navTo(pathname: string) {
  //   window.history.pushState({}, pathname, window.location.origin + pathname);
  //   if (this.root) {
  //     this.root.innerHTML = this.routes[pathname as keyof typeof this.routes];
  //   }
  // }
}
