export class VehicleDetail {
  constructor({
    id,
    name,
    fullName,
    phoneNumber,
    vin,
    engine,
    plate,
    licensePlate,
    color,
    type,
    version,
    capacity,
    purchaseDate,
    regDate,
    warrantyDate,
    warrantyUntil,
    warrantyRemainingDays,
    warrantyPeriod,
    insuranceUntil,
    currentOdo,
    status,
    maintenanceStatus,
    lastMaintenanceDate,
    nextMaintenanceDate,
    nextMaintenanceOdo,
    nextService,
    operatingSpecs,
    timeline,
    documents,
    image,
  }) {
    this.id = id;
    this.name = name;
    this.fullName = fullName;
    this.phoneNumber = phoneNumber;
    this.vin = vin;
    this.engine = engine;
    this.plate = plate || licensePlate;
    this.color = color;
    this.type = type;
    this.version = version;
    this.capacity = capacity;
    this.purchaseDate = purchaseDate;
    this.regDate = regDate;
    this.warrantyDate = warrantyDate || warrantyUntil;
    this.warrantyUntil = warrantyUntil || warrantyDate;
    this.warrantyRemainingDays = warrantyRemainingDays;
    this.warrantyPeriod = warrantyPeriod;
    this.insuranceUntil = insuranceUntil;
    this.currentOdo = currentOdo;
    this.odo = currentOdo != null ? `${currentOdo} km` : '';
    this.status = status;
    this.maintenanceStatus = maintenanceStatus;
    this.lastMaintenanceDate = lastMaintenanceDate;
    this.nextMaintenanceDate = nextMaintenanceDate;
    this.nextMaintenanceOdo = nextMaintenanceOdo;
    this.nextService = nextService || {
      odo: nextMaintenanceOdo ? `${nextMaintenanceOdo}` : '',
      date: nextMaintenanceDate || '',
      items: [],
    };
    this.operatingSpecs = operatingSpecs || {};
    this.timeline = timeline || [];
    this.documents = documents || [];
    this.image = image;
  }
}
