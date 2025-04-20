import { API_ROUTES } from "@/utils/api";
import axios from "axios";
import { create } from "zustand";

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usageCount: number;
}

interface CouponState {
  couponList: Coupon[];
  isLoading: boolean;
  error: string | null;
  fetchAllCoupons: () => Promise<void>;
  createCoupon: (
    coupon: Omit<Coupon, "id" | "usageCount">
  ) => Promise<Coupon | null>;
  deleteCoupon: (id: string) => Promise<boolean>;
}

export const useCouponStore = create<CouponState>((set) => ({
  couponList: [],
  isLoading: false,
  error: null,

  fetchAllCoupons: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_ROUTES.COUPONS}/fetch-all-coupon`,
        {
          withCredentials: true,
        }
      );
      set({ couponList: response.data.couponList, isLoading: false });
    } catch (error) {
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.error
          : "Error to fetch all coupons",
        isLoading: false,
      });
    }
  },
  createCoupon: async (coupon) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API_ROUTES.COUPONS}/create-coupon`,
        coupon,
        {
          withCredentials: true,
        }
      );
      return response.data.coupon;
    } catch (error) {
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.error
          : "Failed to create coupon",
        isLoading: false,
      });
      return null;
    }
  },
  deleteCoupon: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.delete(`${API_ROUTES.COUPONS}/${id}`, {
        withCredentials: true,
      });
      return response?.data?.success;
    } catch (error) {
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.error
          : "Failed to delete coupon",
      });
      return null;
    }
  },
}));
