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
