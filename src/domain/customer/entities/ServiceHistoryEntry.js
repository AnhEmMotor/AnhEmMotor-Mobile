export class ServiceHistoryEntry {
  constructor({
    id,
    date,
    title,
    items,
    cost,
    technician,
    status,
  }) {
    this.id = id;
    this.date = date;
    this.title = title;
    this.items = items || [];
    this.cost = cost;
    this.technician = technician;
    this.status = status || 'done';
  }
}
