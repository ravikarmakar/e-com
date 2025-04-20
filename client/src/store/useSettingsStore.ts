import { API_ROUTES } from "@/utils/api";
import axios from "axios";
import { create } from "zustand";

interface FeatureBannser {
  id: string;
  imageUrl: string;
}

interface FeaturedProduct {
  id: string;
  name: string;
  price: number;
  images: string[];
}

interface SettingsStore {
  banners: FeatureBannser[];
  featuredProducts: FeaturedProduct[];
  isLoading: boolean;
  error: string | null;
  fetchBanners: () => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  addBanners: (files: File[]) => Promise<boolean>;
  updateFeaturedProducts: (productIds: string[]) => Promise<boolean>;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  banners: [],
  featuredProducts: [],
  isLoading: false,
  error: null,

  fetchBanners: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_ROUTES.SETTINGS}/get-banners`, {
        withCredentials: true,
      });

      set({
        banners: response.data.banners,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: (error as Error).message || "Error to fetch banners",
        isLoading: false,
      });
    }
  },

  fetchFeaturedProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_ROUTES.SETTINGS}/fetch-featured-products`,
        { withCredentials: true }
      );

      set({
        featuredProducts: response.data.featuredProducts,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: (error as Error).message || "Error to fetch featured products",
        isLoading: false,
      });
    }
  },

  addBanners: async (files: File[]) => {
    set({ isLoading: true, error: null });
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("banner", file);
    });

    try {
      const response = await axios.post(
        `${API_ROUTES.SETTINGS}/banners`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      set({ isLoading: false });
      return response.data.success;
    } catch (error) {
      set({
        error: (error as Error).message || "Error to add banners",
        isLoading: false,
      });
      return null;
    }
  },

  updateFeaturedProducts: async (productIds: string[]) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API_ROUTES.SETTINGS}/update-featured-products`,
        { productIds },
        { withCredentials: true }
      );
      set({ isLoading: false });
      return response.data.success;
    } catch (error) {
      set({
        error: (error as Error).message || "Error to update featured products",
        isLoading: false,
      });
      return null;
    }
  },
}));
