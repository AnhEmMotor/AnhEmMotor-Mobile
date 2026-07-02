export class CustomerVehicle {
  constructor({
    id,
    name,
    plate,
    vin,
    engine,
    color,
    type,
    version,
    capacity,
    regDate,
    status,
    odo,
    warrantyUntil,
    warrantyFrom,
    insuranceUntil,
    operatingSpecs,
    nextService,
    timeline,
  }) {
    this.id = id;
    this.name = name;
    this.plate = plate;
    this.vin = vin;
    this.engine = engine;
    this.color = color;
    this.type = type;
    this.version = version;
    this.capacity = capacity;
    this.regDate = regDate;
    this.status = status;
    this.odo = odo;
    this.warrantyUntil = warrantyUntil;
    this.warrantyFrom = warrantyFrom;
    this.insuranceUntil = insuranceUntil;
    this.operatingSpecs = operatingSpecs || { oil: '', tirePressure: '' };
    this.nextService = nextService || { odo: '', date: '', items: [] };
    this.timeline = timeline || [];
  }
}
