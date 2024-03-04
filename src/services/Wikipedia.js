import * as L from "leaflet";
import MarkerClusterGroup from 'react-leaflet-markercluster';

export const Wikipedia = {
  id: 'service1',
  name: 'Wikipedia',
  description: 'Displays erticles nera you in choosen language',
  hint: 'Enter a language code',
  baseURL: '',
  tags: [
    { value: 'en', label: 'English', icon: 'newspaper', isActive: false },
    { value: 'pl', label: 'Polski', icon: '🇵🇱', isActive: true }
  ]
};

const clusterOptions = {
  maxClusterRadius: 40,    // Adjust the cluster radius as needed 
  disableClusteringAtZoom: 16  // Disable clustering at zoom level 15 or higher
}

const pointsLimit = 100;

// Define a custom marker icon
const customIcon = (icon) => {
  return L.divIcon({
    iconSize: [32, 32],  // Size of the icon
    iconAnchor: [16, 22], // Anchor point of the icon (centered bottom)
    popupAnchor: [0, -32], // Anchor point for the popup (top of the icon)
    className: 'material-icons',
    html: icon
  })
}



Wikipedia.getLayers = async function ({ center, radius }) {
  if (radius > 10000) { radius = 10000 } // Max radius for API
  let layers = [];

  for (const tag of this.tags) {
    if (tag.isActive) {
      try {

        const response = await fetch(`https://${tag.value}.wikipedia.org/w/api.php?action=query&format=json&list=geosearch&formatversion=2&gscoord=${center.lat}%7C${center.lng}&gsradius=${radius}&gslimit=${pointsLimit}&origin=*`);
        const points = await response.json();


        const markersClusterGroup = L.markerClusterGroup(clusterOptions);
        for (const point of points.query.geosearch) {
          const marker = L.marker([point.lat, point.lon], { icon: customIcon(tag.icon) }).bindPopup(`<a href="https://${tag.value}.wikipedia.org/?curid=${point.pageid}" target="_blank"> ${point.title}</a>`);
          markersClusterGroup.addLayer(marker);
        }

        markersClusterGroup.customLayerName = `${this.name}:${tag.label}`;

        layers.push(markersClusterGroup);
      } catch (error) {
        console.error(`Error fetching data for ${tag.value}:`, error);
      }
    }
  }

  return layers;
}
