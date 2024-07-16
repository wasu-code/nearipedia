import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import RemoteStorage from "remotestoragejs";
import Widget from "remotestorage-widget";
import { toast } from "sonner";
// import "remotestorage-widget/styles.css"; // Optional: include CSS for the widget

const storageKey = "nearipedia-config";
let remoteStorage;
let client;

export function exportLocalConfig(services) {
  const obj = prepareForExport(services);
  localStorage.setItem(storageKey, JSON.stringify(obj));
}

export function importLocalConfig(services) {
  let localStorageData = JSON.parse(localStorage.getItem(storageKey));
  for (const service of services) {
    const serviceId = service.getMetadata().id;
    if (localStorageData && localStorageData[serviceId]) {
      service.setTags(localStorageData[serviceId]);
    }
  }
}

export function initRemoteStorage() {
  toast.info("Login to proceed");
  // Construct and dependency inject
  const remoteStorageInstance = new RemoteStorage({
    changeEvents: { local: true, window: true, remote: true, conflicts: true },
  });
  remoteStorageInstance.access.claim("nearipedia", "rw");
  const clientInstance = remoteStorageInstance.scope("/nearipedia/");

  remoteStorage = remoteStorageInstance;
  client = clientInstance;

  // Initialize widget
  const widget = new Widget(remoteStorageInstance, { leaveOpen: false });
  widget.attach("remotestorage-widget-anchor");
  clientInstance.cache("");

  // Register application state JSON schema
  clientInstance.declareType("services", {
    type: "object",
    properties: {
      list: {
        type: "object",
      },
    },
    required: ["list"],
  });

  // React to application state changes from RS
  // clientInstance.on("change", (event) => {
  //   if (event.relativePath === "services") {
  //     setServices(event.newValue);
  //     console.log(event.newValue);
  //   }
  // });
  toast.success("You are ready to upload/import your config", {
    description: "Click respective buttons to continue",
  });
}

export function importRemoteConfig(services) {
  console.log(client);
  if (client) {
    client.getObject("services").then((storedServices) => {
      if (storedServices && storedServices.list) {
        for (const service of services) {
          const serviceId = service.metadata.id;
          if (storedServices.list[serviceId]) {
            service.setTags(storedServices.list[serviceId]);
          }
        }
      }
    });
    toast.success("Config imported");
  } else {
    initRemoteStorage();
  }
}

export function exportRemoteConfig(services) {
  if (client) {
    let obj = prepareForExport(services);
    client.storeObject("services", "services", { list: obj });
    console.log(obj);
    toast.success("Config exported");
  } else {
    initRemoteStorage();
  }
}

export function exportCSVConfig(services) {
  const fileContent = convertServicesToCSV(services);

  const blob = new Blob([fileContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Nearipedia.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importCSVConfig() {
  throw new Error("NOT IMPLEMENTED");
}

//                                   //

function prepareForExport(services) {
  let obj = {};
  for (const service of services) {
    const serviceId = service.getMetadata().id;
    obj[serviceId] = service.getTags();
  }
  return obj;
}

const convertServicesToCSV = (services) => {
  // Define CSV headers
  const headers = [
    "Service ID",
    "Tag Label",
    "Tag Value",
    "Tag Icon",
    "Tag State",
  ];

  // Map through services and tags to create rows
  const rows = services.flatMap((service) =>
    service.tags.map((tag) => ({
      serviceID: service.metadata.id,
      ...tag,
    }))
  );

  // Create CSV string
  const csvContent = [
    headers.join(", "),
    ...rows.map((row) =>
      [row.serviceID, row.label, row.value, row.icon, row.isActive].join(", ")
    ),
  ].join("\n");

  return csvContent;
};
