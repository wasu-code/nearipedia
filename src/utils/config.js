import { toast } from "sonner";

const storageKey = "nearipedia-config";

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

export function importRemoteConfig() {
  throw new Error("NOT IMPLEMENTED");
}

export function exportRemoteConfig() {
  throw new Error("NOT IMPLEMENTED");
}

function prepareForExport(services) {
  let obj = {};
  for (const service of services) {
    const serviceId = service.getMetadata().id;
    obj[serviceId] = service.getTags();
  }
  return obj;
}
