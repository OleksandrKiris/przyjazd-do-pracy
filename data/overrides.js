(function () {
  const config = window.ARRIVAL_DEFAULT_CONFIG;
  if (!config || !config.locations || !config.locations.siechnice) return;

  const siechnice = config.locations.siechnice;
  const mapsUrl = "https://maps.app.goo.gl/GJc55GLUWFPa6MMcA";

  siechnice.short = "ul. Opolska 30";
  siechnice.address = ["ul. Opolska 30", "55-011 Siechnice", "Polska"];
  siechnice.mapQuery = "ul. Opolska 30, 55-011 Siechnice, Polska";
  siechnice.mapUrl = mapsUrl;

  if (Array.isArray(siechnice.routeLinks)) {
    const mapLink = siechnice.routeLinks.find((link) => /mapa/i.test(link.label || ""));
    if (mapLink) {
      mapLink.label = "Mapa Google - ul. Opolska 30";
      mapLink.url = mapsUrl;
    } else {
      siechnice.routeLinks.push({ label: "Mapa Google - ul. Opolska 30", url: mapsUrl });
    }
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest('[data-action="maps"]');
    if (!button) return;
    const params = new URLSearchParams(location.search);
    const locationKey = (params.get("location") || params.get("lokalizacja") || "siechnice").toLowerCase();
    if (!locationKey.includes("siech")) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    open(mapsUrl, "_blank");
  }, true);
})();
