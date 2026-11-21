/**
 * Web client half of the Harness branding bundle.
 *
 * Occupies the app-level brand slots and decorations:
 *   - `sidebar.brand.mark`  — the colour mark in the expanded row and rail
 *   - `sidebar.brand.name`  — the `Harness` wordmark beside it
 *   - `conversation.hero.brand.mark` — the mark before the home headline
 *
 * The shipped occupants register at priority 0, so a lower priority shadows
 * them (`lowest renders`); registering at the same priority would throw for a
 * single slot. The home headline itself is owned text rather than a slot, so a
 * small generated-content rule in the injected stylesheet replaces it, and the
 * tab icon is re-pointed at an inline copy of the mark.
 *
 * The palette is retinted through the theme service: one override layer
 * replaces the DeepSeek-blue accent aliases with the Harness blue. Primary
 * buttons, switches and checkboxes stay monochrome on purpose — that black /
 * white contrast is the DSH design language, not a brand colour.
 */
window.__ModuleLoader__.load({
  id: '@bndynet/dsh-my-brand',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    const PACKAGE = '@bndynet/dsh-my-brand'
    const PRIORITY = -1000

    /** The mark artwork: 24 × 14.43 units, the same paths as the logo lockup. */
    const MARK_PATHS = [
      { key: 'red', fill: '#d33e32', d: 'M0 0h14.43v4.79H0z' },
      { key: 'blue', fill: '#4d7fbd', d: 'M0 9.64h4.79v4.79H0z' },
      { key: 'green', fill: '#65b34b', d: 'M19.21 0H24v14.43H9.64V9.64h9.57z' },
    ]

    /** Keep the mark vertically centred inside its square slot box. */
    const MARK_OFFSET = 'translate(0 4.785)'

    function markPaths() {
      return MARK_PATHS.map((path) => h('path', { key: path.key, fill: path.fill, d: path.d }))
    }

    function HarnessMark({ size = 24, className }) {
      return h(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          width: size,
          height: size,
          viewBox: '0 0 24 24',
          className,
          'aria-hidden': 'true',
          focusable: 'false',
          style: { display: 'block', flex: 'none' },
        },
        h('g', { transform: MARK_OFFSET }, markPaths()),
      )
    }

    function HarnessName() {
      return h('span', { style: { letterSpacing: 0, whiteSpace: 'nowrap' } }, 'Harness')
    }

    const FAVICON_SVG = [
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">',
      `<g transform="${MARK_OFFSET}">`,
      '<path fill="#d33e32" d="M0 0h14.43v4.79H0z"/>',
      '<path fill="#4d7fbd" d="M0 9.64h4.79v4.79H0z"/>',
      '<path fill="#65b34b" d="M19.21 0H24v14.43H9.64V9.64h9.57z"/>',
      '</g></svg>',
    ].join('')

    /**
     * Accent tokens, retinted from the DeepSeek blue to the mark's blue
     * `#4d7fbd`. The link shade is dark enough to read on white (5.2:1) and
     * the dark shades light enough to read on the dark surface; the mono
     * `--dsw-alias-brand-primary` (buttons, switches) is deliberately left
     * alone. Both palettes are mandatory in an override layer.
     */
    const ACCENT_TOKENS = {
      '--dsw-alias-link': { light: '#3f6ea8', dark: '#8fb3d9' },
      '--dsw-alias-button-info-fill': { light: '#4d7fbd', dark: '#4d7fbd' },
      '--dsw-alias-button-info-hover': { light: '#3f6ea8', dark: '#6d97c8' },
      '--dsw-alias-state-business-primary': { light: '#4d7fbd', dark: '#6d97c8' },
      '--dsw-alias-state-business-tertiary': { light: '#e3ebf5', dark: '#22374d' },
      '--dsw-alias-toast-action': { light: '#8fb3d9', dark: '#8fb3d9' },
      '--dsw-alias-brand-primary-new-colorprimary-new-color': { light: '#4d7fbd', dark: '#6d97c8' },
      '--dsw-alias-label-deep-diving': { light: '#3d5f8c', dark: '#7f9cbc' },
      '--dsw-alias-label-deep-diving-shimmer': { light: '#22405f', dark: '#9db6d1' },
    }

    /**
     * The home headline is rendered from the conversation package's own text,
     * with no slot to occupy; replace it with the brand name for every locale.
     */
    const STYLES = [
      '/* @bndynet/dsh-my-brand */',
      '[class*="titleGroup"] > span:first-child { display: none !important; }',
      '[class*="titleGroup"]::before { content: "Harness"; }',
    ].join('\n')

    /** Install the headline stylesheet; returns its disposal. */
    function installStyles() {
      const tag = document.createElement('style')
      tag.dataset.plugin = PACKAGE
      tag.dataset.pluginCss = `${PACKAGE}/brand.css`
      tag.textContent = STYLES
      document.head.appendChild(tag)
      return () => {
        tag.remove()
      }
    }

    /** Point the browser tab icon at the mark; returns its restoration. */
    function installFavicon() {
      const href = `data:image/svg+xml,${encodeURIComponent(FAVICON_SVG)}`
      const links = Array.from(document.querySelectorAll('link[rel~="icon"]'))
      const previous = links.map((link) => [link, link.getAttribute('href')])
      const created = []
      if (links.length === 0) {
        const link = document.createElement('link')
        link.setAttribute('rel', 'icon')
        link.setAttribute('type', 'image/svg+xml')
        link.setAttribute('href', href)
        document.head.appendChild(link)
        created.push(link)
      } else {
        for (const link of links) link.setAttribute('href', href)
      }
      return () => {
        for (const [link, hrefBefore] of previous) {
          if (hrefBefore === null) link.removeAttribute('href')
          else link.setAttribute('href', hrefBefore)
        }
        for (const link of created) link.remove()
      }
    }

    function apply(ctx) {
      ctx.slots.inject('sidebar.brand.mark', () => ctx.slots.inject('sidebar.brand.name', function* () {
        yield ctx.slots.register({ name: 'sidebar.brand.mark', priority: PRIORITY }, HarnessMark)
        yield ctx.slots.register({ name: 'sidebar.brand.name', priority: PRIORITY }, HarnessName)
      }))

      ctx.slots.inject('conversation.hero.brand.mark', () => ctx.slots.register(
        { name: 'conversation.hero.brand.mark', priority: PRIORITY },
        HarnessMark,
      ))

      if (typeof document !== 'undefined') {
        ctx.effect(installStyles)
        ctx.effect(installFavicon)
      }

      ctx.effect(() => ctx.theme.overrideTokens(PACKAGE, ACCENT_TOKENS))
    }

    return { inject: ['slots', 'theme'], apply }
  },
})
