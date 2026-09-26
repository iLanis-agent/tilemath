/* TileMath engine - honest tile math. UMD: browser global + Node. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.TileMath = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var up = function (x) { return Math.ceil(x - 1e-9); }; // float-safe ceil

  // Straight lay wastes 10%; diagonal and herringbone eat 15% in cuts.
  function wastePct(layout) {
    return layout === 'straight' ? 0.10 : 0.15;
  }

  function tileCount(areaSqFt, tileWIn, tileLIn, layout) {
    var raw = areaSqFt * 144 / (tileWIn * tileLIn);
    return up(raw * (1 + wastePct(layout)));
  }

  // Stores sell boxes, not square feet - and the box is where projects stall.
  function boxesNeeded(areaSqFt, layout, sqftPerBox) {
    return up(areaSqFt * (1 + wastePct(layout)) / sqftPerBox);
  }

  // Grout: joint volume per sq ft x 0.07 lb per cubic inch (sanded grout).
  function groutLbs(areaSqFt, tileWIn, tileLIn, jointIn, depthIn) {
    var perSqFt = (tileWIn + tileLIn) * jointIn * depthIn * 144 / (tileWIn * tileLIn) * 0.07;
    return Math.round(areaSqFt * perSqFt * 100) / 100;
  }

  function groutBags(lbs, bagLbs) {
    bagLbs = bagLbs || 25;
    return up(lbs / bagLbs);
  }

  // 50lb thinset coverage by trowel notch: 1/4" -> 90, 3/8" -> 65, 1/2" -> 45 sq ft.
  var TROWEL_COVERAGE = { '0.25': 90, '0.375': 65, '0.5': 45 };
  function trowelForTile(tileWIn, tileLIn) {
    var longest = Math.max(tileWIn, tileLIn);
    if (longest <= 6) return 0.25;
    if (longest <= 15) return 0.375;
    return 0.5;
  }
  function thinsetBags(areaSqFt, trowelIn) {
    var cov = TROWEL_COVERAGE[String(trowelIn)] || 65;
    return up(areaSqFt / cov);
  }

  function estimate(opts) {
    var area = opts.areaSqFt;
    var w = opts.tileWIn, l = opts.tileLIn;
    var layout = opts.layout || 'straight';
    var boxSqFt = opts.sqftPerBox || 10;
    var price = opts.pricePerSqFt != null ? opts.pricePerSqFt : 3;
    var joint = opts.jointIn != null ? opts.jointIn : 0.125;
    var depth = opts.depthIn != null ? opts.depthIn : 0.375;
    var trowel = opts.trowelIn || trowelForTile(w, l);

    var tiles = tileCount(area, w, l, layout);
    var boxes = boxesNeeded(area, layout, boxSqFt);
    var gLbs = groutLbs(area, w, l, joint, depth);
    var gBags = groutBags(gLbs);
    var tBags = thinsetBags(area, trowel);
    // Tile is priced per sq ft but sold by the box: you pay for the boxes.
    var tileCost = Math.round(boxes * boxSqFt * price * 100) / 100;
    var total = Math.round((tileCost + tBags * 18 + gBags * 16) * 100) / 100;
    return {
      tiles: tiles, boxes: boxes, boxSqFtCharged: boxes * boxSqFt,
      groutLbs: gLbs, groutBags: gBags, thinsetBags: tBags, trowel: trowel,
      tileCost: tileCost, total: total, wastePct: wastePct(layout)
    };
  }

  function advice(est, layout, areaSqFt) {
    if (est.groutLbs > 8 && Math.max(1, 1) && areaSqFt <= 60) {
      return 'That much grout from a small area means small tile - mosaics drink grout through all those joints. Buy the second bag now; running out mid-grout leaves a cold joint that always shows.';
    }
    if (layout !== 'straight') {
      return 'Diagonal and herringbone burn 15% in edge cuts, and every cut edge lands where eyes go. Order the waste, dry-lay the first three rows, and buy every box from the same dye lot - the shade shift between lots reads as a stain.';
    }
    if (est.boxes * est.boxSqFtCharged / est.boxes - areaSqFt > 20) {
      return 'You are buying well over 20 sq ft more than the room - that is the box-count tax. Keep one full box in the attic anyway; the tile gets discontinued the year you crack one.';
    }
    return 'Buy every box from the same dye lot and stash one full box in the attic. The lot you need gets discontinued the year you crack a tile.';
  }

  return {
    wastePct: wastePct,
    tileCount: tileCount,
    boxesNeeded: boxesNeeded,
    groutLbs: groutLbs,
    groutBags: groutBags,
    trowelForTile: trowelForTile,
    thinsetBags: thinsetBags,
    estimate: estimate,
    advice: advice
  };
});
