export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export const API_ROUTES = {
  AUTH: `${API_BASE_URL}/api/auth`,
  PRODUCTS: `${API_BASE_URL}/api/products`,
  COUPONS: `${API_BASE_URL}/api/coupon`,
  SETTINGS: `${API_BASE_URL}/api/settings`,
};
