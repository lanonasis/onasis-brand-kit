# npm @lanonasis/brand-kit@2.0.0 Export Verification

**Checked:** 2026-08-21 from captured registry metadata.
**Registry URL:** https://registry.npmjs.org/@lanonasis/brand-kit

## Findings

| Question | Answer |
|---|---|
| Is `@lanonasis/brand-kit@2.0.0` published? | **No.** |
| Are any `2.x` versions published? | **No.** |
| Latest published dist-tag | `1.1.0` |
| All published versions | `0.1.1`, `1.0.0`, `1.0.1`, `1.1.0` |

## Published exports map (v1.1.0)

```
.
./css
./logos
./favicons
./app-icons
./social-media
```

## Conclusion

Neither `./vue` nor `./assets/*` has ever been published in any released version of `@lanonasis/brand-kit`.

- `./vue` compatibility shim in v2.1 is therefore **forward-compatibility** with the aspirational A1/Pro Kit design, not backward-compatibility with a published release.
- `./assets/*` wildcard compatibility shim is **not required** for published-version compatibility. The versioned exports `./logos`, `./favicons`, `./app-icons`, `./social-media` are sufficient.

## Decision record

Per latest architecture direction (2026-08-21):

- `./vue`: **keep + build** (forward-compatibility shim, explicitly approved).
- `./assets/*`: **do not implement** as a wildcard export. Use versioned exports `./logos`, `./favicons`, `./app-icons`, `./social-media` instead.
