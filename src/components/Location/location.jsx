import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { TextField } from "@mui/material";

const DEFAULT_CENTER = [13.067439, 80.237617];

const LocationComp = () => {
  const mapRef = useRef(null);
  const markerLayerRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [locations, setLocations] = useState([]);

  /* ---------------- MAP INIT ---------------- */
  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map("map").setView(DEFAULT_CENTER, 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }).addTo(map);

    markerLayerRef.current = L.layerGroup().addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  /* ---------------- XML FETCH ---------------- */
  useEffect(() => {
    const parseXML = async () => {
      const res = await fetch("/data.xml");
      const text = await res.text();

      const parser = new DOMParser();
      const xml = parser.parseFromString(text, "text/xml");
      const placemarks = xml.getElementsByTagName("Placemark");

      const parsed = Array.from(placemarks).reduce((acc, p) => {
        const name = p.getElementsByTagName("name")[0]?.textContent;
        const coords = p.getElementsByTagName("coordinates")[0]?.textContent;
        const searchTags =
          p.getElementsByTagName("SearchTags")[0]?.textContent || "";

        if (!name || !coords) return acc;

        const [lon, lat] = coords.split(",").map(Number);
        if (isNaN(lat) || isNaN(lon)) return acc;

        acc.push({ name, lat, lon, searchTags });
        return acc;
      }, []);

      setLocations(parsed);
      renderMarkers(parsed);
    };

    parseXML();
  }, []);

  /* ---------------- MARKER HANDLING ---------------- */
  const renderMarkers = (data) => {
    if (!markerLayerRef.current) return;

    markerLayerRef.current.clearLayers();

    data.forEach((loc) => {
      L.marker([loc.lat, loc.lon])
        .addTo(markerLayerRef.current)
        .bindPopup(`<strong>${loc.name}</strong><br/>${loc.searchTags}`);
    });
  };

  const focusLocation = (loc) => {
    renderMarkers([loc]);
    mapRef.current.setView([loc.lat, loc.lon], 12);
  };

  /* ---------------- FILTER ---------------- */
  const filteredLocations = locations.filter(
    (l) =>
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.searchTags.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ---------------- UI ---------------- */
  return (
    <div className="w-full p-4!">
      <div className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-6!">
        {/* LEFT PANEL */}
        <div className="bg-white rounded-xl shadow p-4! flex flex-col gap-4">
          <h2 className="text-[24px]! text-[#12345a]! font-semibold">
            Search Locations
          </h2>

          <div className="flex gap-2">
            <TextField
              type="text"
              placeholder="Search city, state, pincode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="border rounded-md h-[300px] overflow-y-auto">
            {filteredLocations.length === 0 ? (
              <p className="text-center text-gray-500 py-6">No results found</p>
            ) : (
              filteredLocations.map((loc, i) => {
                const mobile = loc.searchTags.match(/mobile:\s*(\d+)/i)?.[1];
                const email = loc.searchTags.match(
                  /email:\s*([\w.-]+@[\w.-]+\.\w+)/i
                )?.[1];

                return (
                  <div
                    key={i}
                    onClick={() => focusLocation(loc)}
                    className="p-3! cursor-pointer hover:bg-gray-100 flex flex-col items-start! gap-1!"
                  >
                    <span className="font-semibold text-left">{loc.name}</span>
                    <span className="text-sm text-gray-600 text-left">
                      {loc.searchTags}
                    </span>

                    {mobile && (
                      <a
                        href={`tel:${mobile}`}
                        className="text-blue-600 text-sm"
                      >
                        📞 {mobile}
                      </a>
                    )}

                    {mobile && (
                      <a
                        href={`https://wa.me/${mobile}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-green-600 text-sm"
                      >
                        💬 WhatsApp
                      </a>
                    )}

                    {email && (
                      <a
                        href={`mailto:${email}`}
                        className="text-blue-600 text-sm"
                      >
                        ✉️ {email}
                      </a>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* QUICK CONTACT */}
          <div className="flex gap-4 pt-2">
            <a
              href="https://wa.me/919498088659"
              target="_blank"
              className="text-green-600 font-medium"
              rel="noreferrer"
            >
              💬 Chat with us
            </a>
            <a href="tel:+919498088659" className="text-blue-600 font-medium">
              📞 Call us
            </a>
          </div>
        </div>

        {/* MAP */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div id="map" className="w-full h-[350px] md:h-[500px]" />
        </div>
      </div>
    </div>
  );
};

export default LocationComp;
