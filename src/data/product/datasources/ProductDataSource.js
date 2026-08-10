import { getProductsApi, getBrandsApi, getProductDetailApi } from '../../../api/customerApi';
import { API_BASE_URL } from '../../../config';
import { getFullImageUrl } from '../../../utils/imageHelpers';

function normalizeProductItem(item) {
  if (!item || typeof item !== 'object') return null;

  const variants = Array.isArray(item.variants ?? item.Variants)
    ? (item.variants ?? item.Variants).map((v) => ({
        id: v.id ?? v.Id,
        productId: v.productId ?? v.ProductId,
        urlSlug: v.urlSlug ?? v.UrlSlug ?? '',
        price: v.price ?? v.Price,
        coverImageUrl: getFullImageUrl(
          v.cover_image_url ?? v.coverImageUrl ?? v.CoverImageUrl ?? '',
          API_BASE_URL
        ),
        variantName: v.variantName ?? v.VariantName ?? '',
        optionValuesText: v.optionValuesText ?? v.OptionValuesText ?? '',
        photos: Array.isArray(v.photos ?? v.Photos)
          ? (v.photos ?? v.Photos).map((p) => ({
              ...p,
              image: getFullImageUrl(p.image, API_BASE_URL),
            }))
          : [],
        colors: (v.colors ?? v.Colors ?? []).map((c) => ({
          id: c.id ?? c.Id ?? null,
          name: c.name ?? c.ColorName ?? c.Name ?? '',
          colorName: c.colorName ?? c.ColorName ?? c.name ?? '',
          colorCode: c.colorCode ?? c.ColorCode ?? c.code ?? '#ccc',
          code: c.code ?? c.ColorCode ?? '#ccc',
          coverImageUrl: getFullImageUrl(
            c.cover_image_url ?? c.coverImageUrl ?? c.CoverImageUrl ?? c.image ?? '',
            API_BASE_URL
          ),
          image: getFullImageUrl(
            c.cover_image_url ?? c.image ?? c.CoverImageUrl ?? '',
            API_BASE_URL
          ),
          maxPurchaseQuantity: c.maxPurchaseQuantity ?? c.MaxPurchaseQuantity ?? null,
          effectiveMax: c.effectiveMax ?? c.EffectiveMax ?? null,
        })),
        productLimit: v.productLimit ?? v.ProductLimit ?? null,
        effectiveMax: v.effectiveMax ?? v.EffectiveMax ?? null,
      }))
    : [];

  const technologies = Array.isArray(item.technologies ?? item.Technologies)
    ? (item.technologies ?? item.Technologies).map((t) => ({
        technologyId: t.technologyId ?? t.TechnologyId ?? null,
        customTitle: t.customTitle ?? t.CustomTitle ?? '',
        customDescription: t.customDescription ?? t.CustomDescription ?? '',
        customImageUrl: t.customImageUrl ?? t.CustomImageUrl ?? '',
        displayOrder: t.displayOrder ?? t.DisplayOrder ?? 0,
        title: t.title ?? t.Title ?? '',
        description: t.description ?? t.Description ?? '',
        imageUrl: getFullImageUrl(t.imageUrl ?? t.ImageUrl ?? '', API_BASE_URL),
        defaultTitle: t.defaultTitle ?? t.DefaultTitle ?? '',
        defaultDescription: t.defaultDescription ?? t.DefaultDescription ?? '',
        categoryName: t.categoryName ?? t.CategoryName ?? '',
      }))
    : [];

  const rawImgUrl =
    item.cover_image_url ??
    item.imageUrl ??
    item.ImageUrl ??
    item.img ??
    item.coverImageUrl ??
    item.CoverImageUrl ??
    variants[0]?.coverImageUrl ??
    '';
  const resolvedImgUrl = getFullImageUrl(rawImgUrl, API_BASE_URL);

  return {
    ...item,
    id: item.id ?? item.Id,
    name: item.name ?? item.Name ?? item.productName ?? '',
    categoryId: item.categoryId ?? item.CategoryId,
    category: item.category ?? item.Category ?? item.categoryName ?? '',
    brandId: item.brandId ?? item.BrandId,
    brand: item.brand ?? item.Brand ?? item.brandName ?? '',
    displacement: item.displacement ?? item.Displacement ?? null,
    shortDescription: item.shortDescription ?? item.ShortDescription ?? '',
    description: item.description ?? item.Description ?? '',
    imgUrl: resolvedImgUrl,
    imageUrl: resolvedImgUrl,
    referencePrice: item.referencePrice ?? item.ReferencePrice ?? null,
    promotionText: item.promotionText ?? item.PromotionText ?? '',
    technologies,
    variants,
  };
}

export const ProductDataSource = {
  async fetchCatalogProducts(search = '', categoryId = null) {
    const items = await getProductsApi(search, categoryId);
    const normalized = (Array.isArray(items) ? items : [])
      .map((it) => normalizeProductItem(it))
      .filter(Boolean);

    return {
      items: normalized,
      totalCount: normalized.length,
      totalPages: 1,
    };
  },

  async fetchBrands() {
    return getBrandsApi();
  },

  async fetchProductDetail(productId) {
    if (!productId) return null;
    const raw = await getProductDetailApi(productId);
    return normalizeProductItem(raw);
  },
};
