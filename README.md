# @bndynet/dsh-my-brand

A DSH bundle that gives the Web client the **Harness** identity:

| Surface | Result |
| --- | --- |
| Sidebar brand row | Harness colour mark + `Harness` wordmark |
| Collapsed sidebar rail | Harness colour mark |
| Empty-session hero | Harness colour mark before the headline |
| Home headline | `Harness` (the `预览版` / `Preview` badge stays) |
| Browser tab icon | Harness colour mark |
| Accent colour | Links, info buttons, business state and the selection bar use the Harness blue `#4d7fbd` |

The mark, wordmark and headline are replaced for every UI language. The
document title, the installable-app (PWA) icons and the home whale decoration
from the official brand plugin are intentionally left alone. Primary buttons,
switches and checkboxes keep the stock monochrome contrast; only the accent
aliases are retinted.

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

Releases go through GitHub Actions (`.github/workflows/publish.yml`), which
reuses the `bndynet/gh.flows` npm workflow:

- publishing a GitHub Release publishes the `package.json` version to `latest`;
- a manual run only tests unless **publish_enabled** is checked, and
  **publish-version** can bump major/minor/patch and push the `vX.Y.Z` tag.

Before the first run, register the workflow as an npm Trusted Publisher in the
package settings on npmjs.com: repository `bndynet/dsh-my-brand`, workflow
`publish.yml`, environment empty. OIDC needs no `NPM_TOKEN` and adds a
provenance attestation, which relies on the `repository` field in
`package.json`.

There is no build step and no dependencies: `lib/` ships as-is and `npm test`
(`test/smoke.mjs`) is the only check. `npm pack` remains useful locally to
inspect the tarball; the `.tgz` is a pack artifact and is gitignored.

A directory install (`pnpm add <dir>`) links the checkout, so the folder must
stay in place; an npm or tarball install copies the package into the profile.
Keep `engines.dsh` in step with the DSH release you verified.

## How it works

`lib/index.js` is the empty Host half that keeps the Loader row. The Web
module in `lib/client.js`:

- registers `sidebar.brand.mark`, `sidebar.brand.name` and
  `conversation.hero.brand.mark` at priority `-1000`, which shadows the shipped
  occupants (a single slot rejects a second registration at the same priority);
- stacks one theme layer with `ctx.theme.overrideTokens` that maps the
  DeepSeek-blue accent aliases (`link`, `button-info-*`,
  `state-business-primary/tertiary`, `toast-action`, the tab selection colour
  and the thinking-label pair) to the Harness blue;
- injects one stylesheet rule that swaps the home headline for `Harness`;
- repoints the tab icon at an inline copy of the mark and restores the original
  `href` values on unload.

## Notes and limitations

- Web client only; the terminal/Desktop shells are unaffected.
- The headline rule targets the hero's `titleGroup` markup and the tab icon is
  replaced at runtime, so both are checked against the pinned DSH version.
  Bump `engines.dsh` only after re-verifying.
- The accent retint is a theme override layer: it composes over whichever
  theme is active and is removed on unload, so light and dark both follow the
  user's preference.
- PWA manifest icons stay the DSH artwork because they are served statically,
  not part of the client DOM.
- Uninstall or disable the bundle to return to the stock identity; nothing is
  written outside the profile.

## License

MIT
