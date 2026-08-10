export class GetCatalogProducts {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(search = '', categoryId = null) {
    if (!this.repository) {
      throw new Error('Product repository not provided');
    }
    const items = await this.repository.getCatalogProducts(search, categoryId);
    return Array.isArray(items) ? items : [];
  }
}
