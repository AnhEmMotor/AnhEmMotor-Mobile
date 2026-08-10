import { ProductDataSource } from '../datasources/ProductDataSource';

export const ProductRepositoryImpl = {
  async getCatalogProducts(search = '', categoryId = null) {
    const data = await ProductDataSource.fetchCatalogProducts(search, categoryId);
    return data ?? { items: [], totalCount: 0, totalPages: 0 };
  },

  async getProductDetail(productId) {
    return await ProductDataSource.fetchProductDetail(productId);
  },

  async getBrands() {
    try {
      const data = await ProductDataSource.fetchBrands();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.warn('Failed to fetch brands:', error);
      return [];
    }
  },
};
