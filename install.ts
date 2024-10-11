class HTMLAinedElement extends HTMLElement {
    constructor() { super() }
}

class AinedError extends Error {
    override name = 'AinedError'
    constructor(message: string) { 
        super(message) 
    }
}

class AinedWidget {

    private config = {
        protocol: 'http://',
        api: 'api.developer.ainedwork.loc/api/v2/public/',
        widget: 'dev.widget.ainedwork.loc'
    }

    private align = {
        'tl': 'align-items: start !important;',
        'tc': 'align-items: start !important;',
        'tr': 'align-items: start !important;',
        'ml': 'align-items: center !important;',
        'mr': 'align-items: center !important;',
        'bl': 'align-items: end !important;',
        'bc': 'align-items: end !important;',
        'br': 'align-items: end !important;'
    }

    private justify = {
        'tl': 'justify-content: start !important;',
        'tc': 'justify-content: center !important;',
        'tr': 'justify-content: end !important;',
        'ml': 'justify-content: start !important;',
        'mr': 'justify-content: end !important;',
        'bl': 'justify-content: start !important;',
        'bc': 'justify-content: center !important;',
        'br': 'justify-content: end !important;'
    }

    private z = (number: number) => 999999 + number

    // Minified JavaScript implementation of SHA-256 by https://geraintluff.github.io/sha256/
    // @ts-expect-error 
    private sha256 = function r($) { function _(r, $) { return r >>> $ | r << 32 - $ } for (var o, f, n = Math.pow, t = n(2, 32), a = "length", c = "", e = [], i = 8 * $[a], h = r.h = r.h || [], u = r.k = r.k || [], v = u[a], l = {}, s = 2; v < 64; s++)if (!l[s]) { for (o = 0; o < 313; o += s)l[o] = s; h[v] = n(s, .5) * t | 0, u[v++] = n(s, 1 / 3) * t | 0 } for ($ += "\x80"; $[a] % 64 - 56;)$ += "\0"; for (o = 0; o < $[a]; o++) { if ((f = $.charCodeAt(o)) >> 8) return; e[o >> 2] |= f << (3 - o) % 4 * 8 } for (f = 0, e[e[a]] = i / t | 0, e[e[a]] = i; f < e[a];) { var g = e.slice(f, f += 16), k = h; for (o = 0, h = h.slice(0, 8); o < 64; o++) { var x = g[o - 15], d = g[o - 2], p = h[0], w = h[4], A = h[7] + (_(w, 6) ^ _(w, 11) ^ _(w, 25)) + (w & h[5] ^ ~w & h[6]) + u[o] + (g[o] = o < 16 ? g[o] : g[o - 16] + (_(x, 7) ^ _(x, 18) ^ x >>> 3) + g[o - 7] + (_(d, 17) ^ _(d, 19) ^ d >>> 10) | 0), C = (_(p, 2) ^ _(p, 13) ^ _(p, 22)) + (p & h[1] ^ p & h[2] ^ h[1] & h[2]); (h = [A + C | 0].concat(h))[4] = h[4] + A | 0 } for (o = 0; o < 8; o++)h[o] = h[o] + k[o] | 0 } for (o = 0; o < 8; o++)for (f = 3; f + 1; f--) { var S = h[o] >> 8 * f & 255; c += (S < 16 ? 0 : "") + S.toString(16) } return c };

    private installed
    private async install() { await this.init() }
    private async data<Response = unknown>(endpoint: string, options?: RequestInit): Promise<Response> {
        return await (await fetch(`${this.config.protocol}${this.config.api}${endpoint}`, {
            ...options,
            priority: 'high',
            headers: {
                'Accept': 'application/json',
                'X-Tenant': this.tenant,
                'Widget-ID': this.widget,
                'Origin': location.origin
            },
        })).json()
    }
    private url(context: 'i' | 'w') {
        return `${this.config.protocol}${this.tenant}.${this.widget}.${context}.${this.config.widget}`
    }

    private meta: WidgetSettings | undefined
    private id: string
    private container: HTMLAinedElement
    private app: HTMLIFrameElement | null = null
    private button: HTMLElement | null = null

    constructor(private tenant: string, private widget: string) {
        customElements.define('ained-ecosystem', HTMLAinedElement)
        const container = document.createElement('ained-ecosystem')
        this.id = this.sha256(`${this.tenant}${this.widget}`) || `${this.tenant}${this.widget}`
        container.setAttribute('data-tenant', this.tenant)
        container.setAttribute('data-widget', this.widget)
        container.setAttribute('class', `ained-${this.id}-wrapper`)
        container.setAttribute('style', `opacity: 0; transition-duration: 500ms !important;`)
        this.container = container
        this.installed = this.install()
    }

    private async populate() {
        this.meta = (await this.data<WidgetSettingsResponse>('widgets/meta')).data
        const widget = new URL(this.meta.settings.domain)
        if (widget.origin !== location.origin) {
            throw new AinedError(`Widget selected origin not equal to location origin`)
        }
        return {
            meta: this.meta,
            button: {
                show: async () => {
                    await this.installed
                    this.append.button()
                },
                hide: async () => {
                    await this.installed
                    this.destroy.button()
                },
                get: async () => {
                    await this.installed
                    return document.getElementById(`ained-${this.id}-button`)
                },
            },
            app: {
                show: async () => {
                    await this.installed
                    this.append.app()
                },
                hide: async () => {
                    await this.installed
                    this.destroy.app()
                },
                get: async () => {
                    await this.installed
                    return document.getElementById(`ained-${this.id}-app`)
                },
            },
            widget: {
                create: async (parent: HTMLElement) => {
                    await this.installed
                    this.append.widget(parent)
                }
            }
        }
    }

    private style() {
        return /*html*/`
            <style>
                ained-ecosystem {
                    box-sizing: border-box !important;
                    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow !important;
                    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important;
                    transition-duration: 150ms !important;
                    opacity: 1;
                }

                ained-ecosystem[data-tenant] {
                    z-index: ${this.z(0)} !important;
                    pointer-events: none !important;
                    width: 100dvw !important;
                    height: 100dvh !important;
                    position: fixed !important;
                    top: 0 !important;
                    left: 0 !important;
                }

                ained-ecosystem .ained-${this.id}-button-wrapper {
                    z-index: ${this.z(1)} !important;
                    width: 100% !important;
                    height: 100% !important;
                    padding: 24px !important;
                    display: flex !important;
                    top: 0 !important;
                    left: 0 !important;
                    position: absolute !important;
                    ${this.align[this.meta?.visual.button.position as keyof typeof this.align]};
                    ${this.justify[this.meta?.visual.button.position as keyof typeof this.justify]};
                }

                ained-ecosystem .ained-${this.id}-button {
                    pointer-events: all !important;
                    cursor: pointer;
                }

                ained-ecosystem .ained-${this.id}-button:hover {
                    opacity: .7;
                }

                ained-ecosystem .ained-${this.id}-app-wrapper {
                    z-index: ${this.z(1)} !important;
                    width: 100% !important;
                    height: 100% !important;
                    top: 0 !important;
                    left: 0 !important;
                    position: absolute !important;
                }

                ained-ecosystem .ained-${this.id}-app {
                    pointer-events: all !important;
                }
            </style>
        `
    }

    private append = {
        button: () => {
            if (this.button) return
            const event = new CustomEvent('ained-button-show')
            if (!this.meta?.visual.button.enabled) return
            const wrapper = document.createElement('ained-ecosystem')
            const button = document.createElement('ained-ecosystem')
            wrapper?.setAttribute('style', `opacity: 0; transition-duration: 500ms !important;`)
            wrapper.setAttribute('class', `ained-${this.id}-button-wrapper`)
            wrapper.setAttribute('id', `ained-${this.id}-button-wrapper`)
            button.setAttribute('class', `ained-${this.id}-button`)
            button.setAttribute('id', `ained-${this.id}-button`)
            button.innerHTML = this.meta.visual.button.template
            button.addEventListener('click', this.append.app)
            this.button = button
            wrapper.appendChild(button)
            this.container.appendChild(wrapper)
            dispatchEvent(event)
            setTimeout(() => wrapper.setAttribute('style', `opacity: 1; transition-duration: 500ms !important;`), 1)
        },
        app: () => {
            if (this.app) return;
            const event = new CustomEvent('ained-app-show')
            const wrapper = document.createElement('ained-ecosystem')
            const iframe = document.createElement('iframe')
            wrapper.setAttribute('class', `ained-${this.id}-app-wrapper`)
            wrapper.setAttribute('id', `ained-${this.id}-app-wrapper`)
            wrapper?.setAttribute('style', `opacity: 0; transition-duration: 500ms !important;`)
            iframe.setAttribute('class', `ained-${this.id}-app`)
            iframe.setAttribute('id', `ained-${this.id}-app`)
            iframe.setAttribute('width', `100%`)
            iframe.setAttribute('height', `100%`)
            iframe.setAttribute('seamless', '')
            iframe.setAttribute('frameBorder', '0')
            iframe.setAttribute('sandbox', 'allow-downloads allow-same-origin allow-scripts allow-top-navigation-to-custom-protocols')
            iframe.setAttribute('src', this.url('w'))
            this.app = iframe
            wrapper.appendChild(iframe)
            this.container.appendChild(wrapper)
            dispatchEvent(event)
            setTimeout(() => wrapper.setAttribute('style', `opacity: 1; transition-duration: 500ms !important;`), 1)
        },
        widget: (parent: HTMLElement) => {
            const event = new CustomEvent('ained-widget-create')
            const iframe = document.createElement('iframe')
            iframe.setAttribute('class', `ained-${this.id}-${new Date().getTime()}-widget`)
            iframe.setAttribute('id', `ained-${this.id}-${new Date().getTime()}-widget`)
            iframe.setAttribute('width', `100%`)
            iframe.setAttribute('height', `100%`)
            iframe.setAttribute('seamless', '')
            iframe.setAttribute('frameBorder', '0')
            iframe.setAttribute('sandbox', 'allow-downloads allow-same-origin allow-scripts allow-top-navigation-to-custom-protocols')
            iframe.setAttribute('src', this.url('i'))
            parent.appendChild(iframe)
            dispatchEvent(event)
        }
    }

    private destroy = {
        button: () => {
            const event = new CustomEvent('ained-button-hide')
            if (!this.meta?.visual.button.enabled) return
            const wrapper = document.getElementById(`ained-${this.id}-button-wrapper`)
            wrapper?.setAttribute('style', `opacity: 0; transition-duration: 500ms !important;`)
            setTimeout(() => { wrapper?.remove(); this.button = null }, 500)
            dispatchEvent(event)
        },
        app: () => {
            const event = new CustomEvent('ained-app-hide')
            const wrapper = document.getElementById(`ained-${this.id}-app-wrapper`)
            wrapper?.setAttribute('style', `opacity: 0; transition-duration: 500ms !important;`)
            setTimeout(() => { wrapper?.remove(); this.app = null }, 500)
            dispatchEvent(event)
        }
    }

    private message = {
        'close': () => this.destroy.app()
    }

    private async init() {
        const _this = this
        const event = new CustomEvent('ained-ready')
        ;(window as any).ained = await this.populate()
        this.append.button();
        document.body.insertAdjacentHTML('beforeend', '<!-- Ained Ecosystem Widget. Узнать подробнее: https://chess.ained.ru -->')
        document.body.appendChild(this.container)
        document.body.insertAdjacentHTML('beforeend', this.style())
        document.body.insertAdjacentHTML('beforeend', '<!-- Ained Ecosystem Widget. Узнать подробнее: https://chess.ained.ru -->')
        window.addEventListener('message', (event) => {
            const body: { tenant: string, widget: string, event: keyof typeof _this.message, message?: string } = event.data
            if (body.tenant !== _this.tenant || body.widget !== _this.widget) return
            _this.message[body.event]()
        })

        setTimeout(() => this.container.setAttribute('style', `opacity: 1; transition-duration: 500ms !important;`), 500)
        dispatchEvent(event)
    }
}