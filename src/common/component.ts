export default class Component {
    name: string;
    
    constructor(name: string) {
        this.name = name;
    }

    init() {
        // 
    }

    inject(nodeElName: string) {
        const nodeElement: HTMLElement | null = document.querySelector(nodeElName);
        if(nodeElement) this.injectToHTML(nodeElement);
    }

    injectToHTML(nodeEl: HTMLElement) {
        fetch(this.getURLPath()).then(async (data) => {
            const html = await data.text();
            if(nodeEl) nodeEl.innerHTML = html;
            this.init();
        })
    }

    getName(): string {
        return this.name;
    }

    getURLPath(): string {
        return `./${this.name}.html`;
    }
}