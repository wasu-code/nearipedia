import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";

function Map({ markers }) {
  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      scrollWheelZoom={true}
      className="h-full z-0"
      zoomControl={true}
    >
      <CustomMapSettings />

      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {markers}
    </MapContainer>
  );
}

function CustomMapSettings() {
  const map = useMap();

  map.attributionControl.setPosition("topright");

  /*map.zoomControl.remove();
  const customZoomControl = L.control.zoom({ position: 'topright' });
  customZoomControl.addTo(map);*/
  //reposition zoom controls
  const middleHeight = map.getSize().y / 2;
  const zoomControlContainer = document.querySelector(".leaflet-control-zoom");
  zoomControlContainer.style.position = "fixed";
  zoomControlContainer.style.right = "10px";
  zoomControlContainer.style.top = `${middleHeight}px`;

  document.getElementById("locationBtn").addEventListener("click", () => {
    // Button 3 functionality
    centerOnUserLocation();
  });

  function centerOnUserLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          map.setView([lat, lon]);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not available in this browser.");
    }
  }

  return null;
}

export default Map;
