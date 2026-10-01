# Form Field Counter (Chrome, Manifest V3)

Click the toolbar icon on any page with a contact or quote form. It tells you how many visible fields each form has, how many are required, and whether the form is short enough for phone users.

- 5 or fewer visible fields: good for mobile lead capture
- 6-8: trim if you can
- 9+: long for mobile

Part of the free tooling from [Spiel Ventures](https://tommytbomar-dot.github.io/). Related: [form tools compared](https://tommytbomar-dot.github.io/compare-form-tools.html), [mobile lead form kit](https://github.com/tommytbomar-dot/mobile-lead-form-kit).

## Install (unpacked, no store needed)
1. Download this repo (Code > Download ZIP) and unzip.
2. Open `chrome://extensions`, turn on Developer mode.
3. Click **Load unpacked** and pick the unzipped folder.
4. Pin the extension and click it on a page with a form.

## What it counts
Visible `input`, `select`, `textarea` elements inside each `<form>` (hidden, submit, button, reset, image inputs are skipped; radios sharing a name count once). Inputs outside any form are reported as one group.

## Limits
Forms rendered inside cross-origin iframes (some embedded booking widgets) are not counted. Chrome blocks extensions on `chrome://` pages and the Web Store.

## Help
Paid help fixing a long form: [Booking / Quote Page](https://tommytbomar-dot.github.io/svc-booking-page-dfy.html) or [CTA Rescue](https://tommytbomar-dot.github.io/svc-cta-rescue.html). Issues welcome here.

MIT licensed. See PRIVACY.md.
