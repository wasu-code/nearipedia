import { useEffect, useState, useRef } from 'react'
import './App.css'
//import './styles/leaflet.css'

import { Wikipedia } from './services/Wikipedia.js';
import { OSM } from './services/OSM.js';

import * as L from "leaflet";
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'; // sass
import 'react-leaflet-markercluster/dist/styles.min.css';

import { Button } from './components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Separator } from "@/components/ui/separator"
import { toast } from 'sonner';

const Services = [OSM, Wikipedia]

function App() {

  useEffect(() => {

  }, [])

  const renderDrawerHeader = () => {
    return (
      <>
        <DrawerHeader className="flex gap-2">
          <Button variant="secondary" className="material-icons text-2xl">add_box</Button>
          <Button variant="secondary" className="material-icons text-2xl">cloud_upload</Button>
          <Button variant="secondary" className="material-icons text-2xl">cloud_download</Button>
        </DrawerHeader>
        <Separator />
      </>
    )
  }

  return (
    <div className="h-[100vh]">
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

        <Markers />
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>

      </MapContainer>

      <nav className="fixed bottom-0 left-0 z-10 w-full flex gap-2 justify-center p-1">

        <Drawer>
          <DrawerTrigger asChild>
            <Button className="material-icons text-xl aspect-square">info</Button>
          </DrawerTrigger>
          <DrawerContent>
            {renderDrawerHeader()}
            <DrawerFooter>

            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        <Drawer>
          <DrawerTrigger asChild>
            <Button className="material-icons text-xl aspect-square">tune</Button>
          </DrawerTrigger>
          <DrawerContent>
            {renderDrawerHeader()}
            <Separator />
            <DrawerFooter>

            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        <Button
          className="material-icons text-xl aspect-square"
          id="locationBtn"
        >
          my_location
        </Button>
      </nav>
    </div>
  )
}

function CustomMapSettings() {
  const map = useMap();

  map.attributionControl.setPosition('topright');

  /*map.zoomControl.remove();
  const customZoomControl = L.control.zoom({ position: 'topright' });
  customZoomControl.addTo(map);*/
  //reposition zoom controls
  const middleHeight = map.getSize().y / 2;
  const zoomControlContainer = document.querySelector('.leaflet-control-zoom');
  zoomControlContainer.style.position = "fixed"
  zoomControlContainer.style.right = "10px"
  zoomControlContainer.style.top = `${middleHeight}px`;

  document.getElementById("locationBtn").addEventListener("click", () => {
    // Button 3 functionality
    centerOnUserLocation();
  });

  function centerOnUserLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        map.setView([lat, lon]);
      }, error => {
        console.error('Error getting user location:', error);
      });
    } else {
      console.error('Geolocation is not available in this browser.');
    }
  }

  return null;
}

function Markers() {
  const map = useMap();

  map.on('moveend', () => {
    const zoom = map.getZoom();
    if (zoom < 11) {
      toast('Zoom in to display new markers')
    } else {
      toast.dismiss()
      //fetch and display new markers
      updateMarkers();
    }
  });

  map.on('zoomend', function () {
    const zoom = map.getZoom();
    if (zoom < 11) {
      toast('Zoom in to display new markers')
    } else {
      toast.dismiss()
      //fetch and display new markers
      updateMarkers();
    }
  });

  function removeLayerByName(name) {
    map.eachLayer(layer => {
      if (layer.customLayerName === name) {
        map.removeLayer(layer);
      }
    });
  }

  const updateMarkers = () => {
    const bbox = map.getBounds(); // Get the current bounding box
    const center = map.getCenter();
    const radius = Math.round(center.distanceTo([bbox._northEast.lat, bbox._northEast.lng]));

    //fetch
    for (const service of Services) {
      service.getLayers({ bbox: bbox, center: center, radius: radius })
        .then(layers => {
          for (const layer of layers) {
            removeLayerByName(layer.customLayerName); //remove old layer
            map.addLayer(layer);
          }
        })
    }
  }

}

export default App
