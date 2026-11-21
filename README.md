# @bndynet/dsh-my-brand

A DSH bundle that gives the Web client the **Harness** identity:

| Surface | Result |
| --- | --- |
| Sidebar brand row | Harness colour mark + `Harness` wordmark |
| Collapsed sidebar rail | Harness colour mark |
| Empty-session hero | Harness colour mark before the headline |
| Home headline | `Harness` (the `预览版` / `Preview` badge stays) |
| Browser tab icon | Harness colour mark |

The mark, wordmark and headline are replaced for every UI language. The
document title, the installable-app (PWA) icons and the home whale decoration
from the official brand plugin are intentionally left alone.

## Requirements

- DSH **0.2.2-rc.5** Web client (the bundle pins this in `engines.dsh`)
- Node.js **>= 24.9.0**

## Install

From npm (after the package is published):

```sh
dsh plugin add @bndynet/dsh-my-brand
```

or in the Web UI: **Plugins** → **Add plugin** → `@bndynet/dsh-my-brand`
→ **Enable now**. A packed tarball works the same way by absolute path.

The bundle inserts one row, `my-brand`, and takes effect after a page
refresh. No build step runs on install; `lib/` is plain ESM.

## Publish (owner)

The package has no dependencies and no build step; `prepack` runs the smoke
test in `test/smoke.mjs`:

```sh
npm pack
# bndynet-dsh-my-brand-0.1.0.tgz: lib/, cordis.patch.yml, locale/,
# icon.svg, README.md, LICENSE
npm publish ./bndynet-dsh-my-brand-0.1.0.tgz --access public \
  --registry=https://registry.npmjs.org
```

A directory install (`pnpm add <dir>`) links the checkout, so the folder must
stay in place; an npm or tarball install copies the package into the profile.
Keep `engines.dsh` in step with the DSH release you verified.

## How it works

`lib/index.js` is the empty Host half that keeps the Loader row. The Web
module in `lib/client.js`:

- registers `sidebar.brand.mark`, `sidebar.brand.name` and
  `conversation.hero.brand.mark` at priority `-1000`, which shadows the shipped
  occupants (a single slot rejects a second registration at the same priority);
- injects one stylesheet rule that swaps the home headline for `Harness`;
- repoints the tab icon at an inline copy of the mark and restores the original
  `href` values on unload.

## Notes and limitations

- Web client only; the terminal/Desktop shells are unaffected.
- The headline rule targets the hero's `titleGroup` markup and the tab icon is
  replaced at runtime, so both are checked against the pinned DSH version.
  Bump `engines.dsh` only after re-verifying.
- PWA manifest icons stay the DSH artwork because they are served statically,
  not part of the client DOM.
- Uninstall or disable the bundle to return to the stock identity; nothing is
  written outside the profile.

## License

MIT
