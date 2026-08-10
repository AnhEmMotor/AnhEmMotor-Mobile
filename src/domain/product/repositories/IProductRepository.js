export const IProductRepository = {
  async getCatalogProducts(_search = '', _categoryId = null) {
    throw new Error('IProductRepository.getCatalogProducts not implemented');
  },

  async getProductDetail(_productId) {
    throw new Error('IProductRepository.getProductDetail not implemented');
  },

  async getBrands() {
    throw new Error('IProductRepository.getBrands not implemented');
  },
};
