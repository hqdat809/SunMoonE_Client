import { IProductResponse } from "../interfaces/product-interface";
import { EUserTypeCategory } from "../interfaces/user-interfaces";

export const getPriceByRole = (
  p: IProductResponse | undefined,
  userRole: string | undefined
): number => {
  if (!p) return 0;

  // Use basePrice as the absolute fallback if anything goes wrong
  const basePrice = p.basePrice || 0;

  // If there are no pricebooks, default to basePrice
  if (!p.priceBooks || p.priceBooks.length === 0) {
    return basePrice;
  }

  // Find the pricebook according to user role
  switch (userRole) {
    case EUserTypeCategory.USER: {
      const retailPriceBook = p.priceBooks.find(
        (pb) => pb.priceBookName === "Giá lẻ"
      );
      return retailPriceBook ? retailPriceBook.price : basePrice;
    }
    case EUserTypeCategory.CTV1: {
      const ctv1PriceBook = p.priceBooks.find(
        (pb) => pb.priceBookName === "CTV_1"
      );
      return ctv1PriceBook ? ctv1PriceBook.price : basePrice;
    }
    case EUserTypeCategory.CTV2: {
      const ctv2PriceBook = p.priceBooks.find(
        (pb) => pb.priceBookName === "CTV_2"
      );
      return ctv2PriceBook ? ctv2PriceBook.price : basePrice;
    }
    case EUserTypeCategory.CTV3: {
      const ctv3PriceBook = p.priceBooks.find(
        (pb) => pb.priceBookName === "CTV_3"
      );
      return ctv3PriceBook ? ctv3PriceBook.price : basePrice;
    }
    default:
      return basePrice;
  }
};
