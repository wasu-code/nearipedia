import * as L from "leaflet";
// eslint-disable-next-line no-unused-vars
import MarkerClusterGroup from "react-leaflet-markercluster";
import APIService from "./APIService";

const metadata = {
  id: "service2",
  name: "OpenStreetMap Tags",
  description: "Displays OSM tags using Overpass API",
  hint: "Enter a valid tag: key=value",
  baseURL: "https://overpass-api.de/api/interpreter?",
};

const clusterOptions = {
  maxClusterRadius: 40, // Adjust the cluster radius as needed
  disableClusteringAtZoom: 16, // Disable clustering at zoom level 15 or higher
};

// Define a custom marker icon
const customIcon = (icon) => {
  return L.divIcon({
    iconSize: [32, 32], // Size of the icon
    iconAnchor: [16, 22], // Anchor point of the icon (centered bottom)
    popupAnchor: [0, -32], // Anchor point for the popup (top of the icon)
    className: "material-icons",
    html: icon,
  });
};

class OverpassTurbo extends APIService {
  constructor() {
    super();
    this.setMetadata(metadata);
    this.setTags([
      {
        value: "amenity=shelter",
        label: "Shelter",
        icon: "roofing",
        isActive: true,
      },
      {
        value: "amenity=toilets",
        label: "Toilets",
        icon: "wc",
        isActive: true,
      },
    ]);
  }

  async getLayers({ bbox }) {
    let layers = [];
    bbox = `
      ${bbox._southWest.lat},
      ${bbox._southWest.lng},
      ${bbox._northEast.lat},
      ${bbox._northEast.lng}
    `;

    for (const tag of this.getTags()) {
      if (tag.isActive) {
        try {
          const response = await fetch(metadata.baseURL, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: `[out:json];
                  (
                    node[${tag.value}](${bbox});
                    way[${tag.value}](${bbox});
                    relation[${tag.value}](${bbox});
                  );
                  out center;`,
          });
          const points = await response.json();
          const markersClusterGroup = L.markerClusterGroup(clusterOptions);
          for (const point of points.elements) {
            let subtags = "";
            for (const key in point.tags) {
              if (Object.hasOwnProperty.call(point.tags, key)) {
                const value = point.tags[key];
                const line = `${key}: ${value} <br/> `;
                subtags += line;
              }
            }

            let lat, lon;
            if (point.type === "node") {
              lat = point.lat;
              lon = point.lon;
            } else {
              lat = point.center.lat;
              lon = point.center.lon;
              subtags += "<br/> Center of way/polygon is shown";
            }

            const marker = L.marker([lat, lon], {
              icon: customIcon(tag.icon),
            }).bindPopup(`Type: ${tag.label} <br/> <br/> ${subtags}`);
            markersClusterGroup.addLayer(marker);
          }

          markersClusterGroup.customLayerName = `${metadata.name}:${tag.label}`;

          layers.push(markersClusterGroup);
        } catch (error) {
          console.error(`Error fetching data for ${tag.value}:`, error);
        }
      }
    }
    return layers;
  }
}

export default OverpassTurbo;
