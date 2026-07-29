export const IProductRepository = {
  async getCatalogProducts(search = '', categoryId = null) {
    throw new Error('IProductRepository.getCatalogProducts not implemented');
  },

  async getProductDetail(productId) {
    throw new Error('IProductRepository.getProductDetail not implemented');
  },

  async getBrands() {
    throw new Error('IProductRepository.getBrands not implemented');
  },
};
