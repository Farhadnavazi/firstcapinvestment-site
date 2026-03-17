/* ═══════════════════════════════════════════════════════
   FCIR Interactive Property Map — Leaflet + OpenStreetMap
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var mapEl = document.getElementById('fcirMap');
  if (!mapEl || typeof L === 'undefined' || typeof FCIR_PROPERTIES === 'undefined') return;

  /* --- Colours -------------------------------------------------- */
  var GOLD = '#c9a84c';
  var NAVY = '#0a1628';
  var NAVY_MID = '#152542';
  var WHITE = '#ffffff';
  var SOLD_COLOUR = '#6b8cae';   /* muted blue for sold */
  var OFFICE_COLOUR = '#e8d5a0'; /* gold-pale for offices */

  /* --- Create Map ----------------------------------------------- */
  var map = L.map('fcirMap', {
    center: [34.1, -118.1],
    zoom: 9,
    scrollWheelZoom: false,
    zoomControl: false,
    attributionControl: true
  });

  L.control.zoom({ position: 'topright' }).addTo(map);

  /* Dark tile layer matching the navy brand */
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  /* --- Custom Marker Icons -------------------------------------- */
  function createIcon(colour, size, isOffice) {
    var s = size || 12;
    var half = s / 2;
    var svg;
    if (isOffice) {
      /* Star shape for offices */
      svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + (s + 8) + '" height="' + (s + 8) + '" viewBox="0 0 24 24">' +
        '<polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" ' +
        'fill="' + colour + '" stroke="' + WHITE + '" stroke-width="1.5"/></svg>';
      return L.divIcon({
        className: 'fcir-marker fcir-marker--office',
        html: svg,
        iconSize: [s + 8, s + 8],
        iconAnchor: [(s + 8) / 2, (s + 8) / 2],
        popupAnchor: [0, -(s + 8) / 2]
      });
    }
    svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + s + '" height="' + s + '">' +
      '<circle cx="' + half + '" cy="' + half + '" r="' + (half - 1) + '" fill="' + colour + '" stroke="' + WHITE + '" stroke-width="1.5" opacity="0.92"/></svg>';
    return L.divIcon({
      className: 'fcir-marker',
      html: svg,
      iconSize: [s, s],
      iconAnchor: [half, half],
      popupAnchor: [0, -half]
    });
  }

  var icons = {
    active: createIcon(GOLD, 18, false),
    sold: createIcon(SOLD_COLOUR, 11, false),
    office: createIcon(OFFICE_COLOUR, 22, true)
  };

  /* --- Build Popup ---------------------------------------------- */
  function makePopup(p) {
    var badge = '';
    if (p.category === 'active') badge = '<span class="map-popup__badge map-popup__badge--active">Active</span>';
    else if (p.category === 'sold') badge = '<span class="map-popup__badge map-popup__badge--sold">Sold</span>';
    else badge = '<span class="map-popup__badge map-popup__badge--office">Office</span>';

    var priceHtml = p.price ? '<div class="map-popup__price">' + p.price + '</div>' : '';
    var typeHtml = p.type && p.type !== 'Office' ? '<div class="map-popup__type">' + p.type + '</div>' : '';

    return '<div class="map-popup">' +
      badge +
      '<div class="map-popup__title">' + p.title + '</div>' +
      '<div class="map-popup__address">' + p.address + '</div>' +
      priceHtml +
      typeHtml +
      '</div>';
  }

  /* --- Add Markers ---------------------------------------------- */
  var allMarkers = [];
  var layerGroups = { active: [], sold: [], office: [] };

  FCIR_PROPERTIES.forEach(function (p) {
    var icon = icons[p.category] || icons.sold;
    var marker = L.marker([p.lat, p.lng], { icon: icon })
      .bindPopup(makePopup(p), {
        className: 'fcir-popup',
        maxWidth: 260,
        minWidth: 200
      });
    marker._fcirCategory = p.category;
    allMarkers.push(marker);
    layerGroups[p.category].push(marker);
  });

  var markerGroup = L.featureGroup(allMarkers).addTo(map);

  /* Fit bounds to show all markers */
  if (allMarkers.length > 0) {
    map.fitBounds(markerGroup.getBounds().pad(0.08));
  }

  /* --- Filter Buttons ------------------------------------------- */
  var filterBtns = document.querySelectorAll('.prop-map__filter');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var filter = btn.getAttribute('data-filter');

      allMarkers.forEach(function (m) {
        map.removeLayer(m);
      });

      if (filter === 'all') {
        allMarkers.forEach(function (m) { m.addTo(map); });
        map.fitBounds(markerGroup.getBounds().pad(0.08));
      } else {
        var filtered = layerGroups[filter] || [];
        filtered.forEach(function (m) { m.addTo(map); });
        if (filtered.length > 0) {
          var fg = L.featureGroup(filtered);
          map.fitBounds(fg.getBounds().pad(0.15));
        }
      }
    });
  });

  /* --- Enable scroll zoom after first interaction --------------- */
  map.once('focus', function () {
    map.scrollWheelZoom.enable();
  });

})();
