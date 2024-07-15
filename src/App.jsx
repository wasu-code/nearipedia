import {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import "./App.css";
//import './styles/leaflet.css'

// eslint-disable-next-line no-unused-vars
import * as L from "leaflet";
import { useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // sass
import "react-leaflet-markercluster/dist/styles.min.css";

import { Button } from "./components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { loadService } from "./utils/serviceFactory";
import TagSelector from "./components/TagSelectror";
import Map from "./components/map/Map";
import { X } from "lucide-react";

const OSM = await loadService("OverpassTurbo");
const Wikipedia = await loadService("Wikipedia");
const Services = [OSM, Wikipedia];

function App() {
  const markersRef = useRef();

  const renderDrawerHeader = () => {
    return (
      <>
        <DrawerHeader className="flex gap-2">
          <Button variant="secondary" className="material-icons text-2xl">
            add_box
          </Button>
          <Button variant="secondary" className="material-icons text-2xl">
            cloud_upload
          </Button>
          <Button variant="secondary" className="material-icons text-2xl">
            cloud_download
          </Button>
          <DrawerClose className="ml-auto px-1">
            <X />
          </DrawerClose>
        </DrawerHeader>
        <Separator />
      </>
    );
  };

  return (
    <div className="h-[100vh]">
      <Map markers={<Markers ref={markersRef} />} />

      <nav className="fixed bottom-0 left-0 z-10 w-full flex gap-2 justify-center p-1">
        <Drawer>
          <DrawerTrigger asChild>
            <Button className="material-icons text-xl aspect-square">
              info
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            {renderDrawerHeader()}
            <div>dadw</div>
            <DrawerFooter></DrawerFooter>
          </DrawerContent>
        </Drawer>

        <Drawer
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              markersRef.current.updateMarkers();
            }
          }}
        >
          <DrawerTrigger asChild>
            <Button className="material-icons text-xl aspect-square">
              tune
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            {renderDrawerHeader()}
            <Separator />
            <div className="p-4">
              {Services.map((service) => (
                <TagSelector key={service.metadata.id} service={service} />
              ))}
            </div>
            <DrawerFooter></DrawerFooter>
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
  );
}

const Markers = forwardRef((props, ref) => {
  const map = useMap();

  useImperativeHandle(ref, () => ({
    updateMarkers,
  }));

  useEffect(() => {
    updateMarkers();
  }, []);

  map.on("moveend", () => {
    const zoom = map.getZoom();
    if (zoom < 11) {
      toast("Zoom in to display new markers");
    } else {
      toast.dismiss();
      //fetch and display new markers
      updateMarkers();
    }
  });

  map.on("zoomend", function () {
    const zoom = map.getZoom();
    if (zoom < 11) {
      toast("Zoom in to display new markers");
    } else {
      toast.dismiss();
      //fetch and display new markers
      updateMarkers();
    }
  });

  function removeLayerByName(name) {
    map.eachLayer((layer) => {
      if (layer.customLayerName === name) {
        map.removeLayer(layer);
      }
    });
  }

  function removeLayersByPrefix(prefix) {
    map.eachLayer((layer) => {
      if (layer.customLayerName && layer.customLayerName.startsWith(prefix)) {
        map.removeLayer(layer);
      }
    });
  }

  const updateMarkers = () => {
    const t = toast.loading("Updating markers");
    const bbox = map.getBounds(); // Get the current bounding box
    const center = map.getCenter();
    const radius = Math.round(
      center.distanceTo([bbox._northEast.lat, bbox._northEast.lng])
    );
    // Array to hold promises for each service
    const promises = [];
    for (const service of Services) {
      // Push each service's promise to the promises array
      promises.push(
        service
          .getLayers({ bbox: bbox, center: center, radius: radius })
          .then((layers) => {
            removeLayersByPrefix(service.getMetadata().name);
            for (const layer of layers) {
              //removeLayerByName(layer.customLayerName); //remove old layer
              map.addLayer(layer);
            }
          })
      );
    }

    // Wait for all promises to resolve
    Promise.all(promises)
      .then(() => {
        // Dismiss the toast once all promises have resolved
        toast.dismiss(t);
      })
      .catch((error) => {
        // Handle errors if any of the promises reject
        console.error("Error updating markers:", error);
        toast.dismiss(t); // Dismiss the toast in case of error as well
      });
  };

  return null;
});
Markers.displayName = "Markers";

export default App;