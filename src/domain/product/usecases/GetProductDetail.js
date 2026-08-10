export class GetProductDetail {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(productId) {
    if (!this.repository) {
      throw new Error('Product repository not provided');
    }
    if (!productId) return null;
    return await this.repository.getProductDetail(productId);
  }
}
