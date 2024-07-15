export const loadService = async (serviceName) => {
  try {
    console.log(`Loading service: ${serviceName}`);
    const module = await import(`@/services/${serviceName}.js`);
    console.log(`Module loaded:`, module);
    const ServiceClass = module.default;
    console.log(`Loaded service class: ${ServiceClass.name}`);
    const serviceInstance = new ServiceClass();
    console.log(`Instantiated service:`, serviceInstance);
    return serviceInstance;
  } catch (error) {
    console.error(`Error loading service ${serviceName}:`, error);
    throw new Error(`Service ${serviceName} not found.`);
  }
};
