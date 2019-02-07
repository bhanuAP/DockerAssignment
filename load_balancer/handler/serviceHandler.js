class ServiceHandler {
  constructor() {
    this.services = [];
    this.index = 0;
  }

  register(service) {
    this.services.push(service);
  }

  getServices() {
    return this.services;
  }

  getNextService() {
    this.index = this.index == this.services.length ? 0 : this.index;
    let currentService = this.services[this.index];
    ++this.index;
    return currentService;
  }
}

module.exports = ServiceHandler;
