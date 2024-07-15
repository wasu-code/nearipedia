export const loadService = async (serviceName) => {
  try {
    const module = await import(`@/services/${serviceName}.js`);
    const ServiceClass = module.default;
    const serviceInstance = new ServiceClass();
    return serviceInstance;
  } catch (error) {
    console.error(`Error loading service ${serviceName}:`, error);
    throw new Error(`Service ${serviceName} not found.`);
  }
};
