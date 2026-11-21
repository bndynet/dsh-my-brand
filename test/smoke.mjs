/**
 * Smoke test: load the client module the way the Web page does (a module
 * loader factory), run `apply` against a stub slot registry, and check the
 * registrations plus the style and favicon effects.
 */
import assert from 'node:assert/strict'

const listeners = []
globalThis.window = {
  __ModuleLoader__: {
    load(definition) {
      listeners.push(definition)
    },
  },
}

const created = []
globalThis.document = {
  head: {
    appendChild(element) {
      element.parent = 'head'
    },
  },
  createElement(tag) {
    const element = {
      tag,
      dataset: {},
      attributes: {},
      setAttribute(name, value) {
        this.attributes[name] = value
      },
      removeAttribute(name) {
        delete this.attributes[name]
      },
      remove() {
        this.removed = true
      },
    }
    created.push(element)
    return element
  },
  querySelectorAll() {
    return []
  },
}

await import('../lib/client.js')
assert.equal(listeners.length, 1, 'one module registered')
const definition = listeners[0]
assert.equal(definition.id, '@bndynet/dsh-my-brand')

const React = {
  createElement(type, props, ...children) {
    return { type, props, children }
  },
}
const registered = []
const effects = []
const ctx = {
  slots: {
    inject(_name, callback) {
      const result = callback()
      // Cordis iterates a generator callback so each yield registers an effect.
      if (result !== null && typeof result === 'object' && typeof result.next === 'function') {
        for (const _ of result) { /* drain yielded registrations */ }
      }
      return result
    },
    register(options, component) {
      registered.push({ options, component })
      return () => {}
    },
  },
  effect(factory) {
    effects.push(factory())
  },
}

const exports = definition.factory((specifier) => {
  assert.equal(specifier, 'react')
  return React
})
assert.deepEqual(exports.inject, ['slots'])
exports.apply(ctx)

assert.equal(registered.length, 3)
const bySlot = new Map(registered.map((row) => [row.options.name, row.options]))
assert.equal(bySlot.get('sidebar.brand.mark').priority, -1000)
assert.equal(bySlot.get('sidebar.brand.name').priority, -1000)
assert.equal(bySlot.get('conversation.hero.brand.mark').priority, -1000)

const mark = bySlot.get('sidebar.brand.mark')
assert.ok(mark)
const rendered = registered.find((row) => row.options.name === 'sidebar.brand.mark').component({ size: 34 })
assert.equal(rendered.type, 'svg')
assert.equal(rendered.props.width, 34)

const name = registered.find((row) => row.options.name === 'sidebar.brand.name').component({})
assert.equal(name.children[0], 'Harness')

assert.equal(effects.length, 2)
assert.ok(effects.every((dispose) => typeof dispose === 'function'))
const style = created.find((element) => element.tag === 'style')
assert.ok(style.textContent.includes('content: "Harness"'))
const favicon = created.find((element) => element.tag === 'link')
assert.ok(favicon.attributes.href.startsWith('data:image/svg+xml,'))
for (const dispose of effects) dispose()

console.log('ok: 3 slot registrations, stylesheet and favicon installed, disposal available')
