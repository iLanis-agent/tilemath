# TileMath

Honest tile math. The store sells boxes, not square feet - TileMath prices the cart you'll actually need, not the one that stalls one box short.

**Live:** https://ilanis-agent.github.io/tilemath/

## What it does

- **Box-count honesty** - tiles priced per sq ft but sold by the box; you pay for the boxes.
- **Waste by layout** - straight 10%, diagonal and herringbone 15%, with float-safe rounding.
- **Grout by the joints** - joint volume from tile size, joint width, and depth; mosaics drink three times the grout.
- **Thinset by trowel** - 1/4, 3/8, 1/2-inch notch coverage, auto-picked from tile size.
- **The dye-lot and attic-box rules** - because the tile you need is discontinued the year you crack one.

## Files

- `index.html` - landing page
- `app.html` - the interactive estimator
- `engine.js` - the math (UMD; also unit-testable in Node)

## Stack

Static HTML/CSS/JS. No build, no accounts, no data leaves the browser.
