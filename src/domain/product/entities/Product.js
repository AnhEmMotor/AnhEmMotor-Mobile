export class Product {
  constructor(data = {}) {
    this.id = data.id ?? null;
    this.name = data.name ?? data.Name ?? '';
    this.categoryId = data.categoryId ?? data.CategoryId ?? null;
    this.category = data.category ?? data.Category ?? '';
    this.brandId = data.brandId ?? data.BrandId ?? null;
    this.brand = data.brand ?? data.Brand ?? '';
    this.displacement = data.displacement ?? data.Displacement ?? null;
    this.shortDescription = data.shortDescription ?? data.ShortDescription ?? '';
    this.description = data.description ?? data.Description ?? '';

    this.imgUrl = data.imgUrl ?? data.ImageUrl ?? '';
    this.imageUrl = data.imageUrl ?? data.ImageUrl ?? '';

    this.referencePrice = data.referencePrice ?? data.ReferencePrice ?? null;
    this.promotionText = data.promotionText ?? data.PromotionText ?? '';

    this.technologies = Array.isArray(data.technologies ?? data.Technologies)
      ? (data.technologies ?? data.Technologies) : [];

    this.variants = Array.isArray(data.variants ?? data.Variants)
      ? (data.variants ?? data.Variants).map((v, i) => new ProductVariant(v, i))
      : [];
  }

  get cheapestPrice() {
    if (!Array.isArray(this.variants) || this.variants.length === 0) return null;
    return Math.min(...this.variants.filter(v => v.price != null).map(v => v.price));
  }

  get primaryImage() {
    if (this.variants.length > 0 && this.variants[0].coverImageUrl) return this.variants[0].coverImageUrl;
    return this.imgUrl || this.imageUrl || '';
  }
}

export class ProductVariant {
  constructor(data, index = 0) {
    this.id = data.id ?? data.Id ?? null;
    this.productId = data.productId ?? data.ProductId ?? null;
    this.urlSlug = data.urlSlug ?? data.UrlSlug ?? '';
    this.price = data.price ?? data.Price ?? null;
    this.coverImageUrl = data.coverImageUrl ?? data.CoverImageUrl ?? '';
    this.variantName = data.variantName ?? data.VariantName ?? '';
    this.optionValuesText = data.optionValuesText ?? data.OptionValuesText ?? '';
    this.productLimit = data.productLimit ?? data.ProductLimit ?? null;
    this.effectiveMax = data.effectiveMax ?? data.EffectiveMax ?? null;
    this.photos = Array.isArray(data.photos ?? data.Photos) ? (data.photos ?? data.Photos) : [];

    this.colors = Array.isArray(data.colors ?? data.Colors)
      ? (data.colors ?? data.Colors).map((c, i) => new ProductVariantColor(c, i))
      : [];
  }

  get primaryImage() {
    if (this.colors.length > 0 && this.colors[0].coverImageUrl) return this.colors[0].coverImageUrl;
    return this.coverImageUrl || '';
  }

  get displayName() {
    const parts = [];
    if (this.variantName && !this.optionValuesText) parts.push(this.variantName);
    if (this.optionValuesText && this.optionValuesText !== this.variantName) parts.push(this.optionValuesText);
    if (this.colors.length > 0 && this.colors[0].name) parts.push(this.colors[0].name);
    return parts.join(' - ') || '';
  }
}

export class ProductVariantColor {
  constructor(data, index = 0) {
    this.id = data.id ?? data.Id ?? null;
    this.name = data.name ?? data.ColorName ?? data.Name ?? '';
    this.colorName = data.colorName ?? data.ColorName ?? data.name ?? '';
    this.colorCode = data.colorCode ?? data.ColorCode ?? data.code ?? '#ccc';
    this.code = this.colorCode;
    this.coverImageUrl = data.coverImageUrl ?? data.CoverImageUrl ?? data.image ?? '';
    this.image = this.coverImageUrl;
    this.maxPurchaseQuantity = data.maxPurchaseQuantity ?? data.MaxPurchaseQuantity ?? null;
    this.effectiveMax = data.effectiveMax ?? data.EffectiveMax ?? null;
  }
}

export class ProductTechnology {
  constructor(data = {}) {
    this.technologyId = data.technologyId ?? data.TechnologyId ?? null;
    this.customTitle = data.customTitle ?? data.CustomTitle ?? '';
    this.customDescription = data.customDescription ?? data.CustomDescription ?? '';
    this.customImageUrl = data.customImageUrl ?? data.CustomImageUrl ?? '';
    this.displayOrder = data.displayOrder ?? data.DisplayOrder ?? 0;
    this.title = data.title ?? data.Title ?? this.customTitle;
    this.description = data.description ?? data.Description ?? this.customDescription;
    this.imageUrl = data.imageUrl ?? data.ImageUrl ?? this.customImageUrl;
    this.defaultTitle = data.defaultTitle ?? data.DefaultTitle ?? '';
    this.defaultDescription = data.defaultDescription ?? data.DefaultDescription ?? '';
    this.categoryName = data.categoryName ?? data.CategoryName ?? '';
  }
}
