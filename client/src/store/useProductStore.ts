import { API_ROUTES } from "@/utils/api";
import axios from "axios";
import { create } from "zustand";

export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  category: string;
  gender: string;
  sizes: string[];
  colors: string[];
  price: number;
  stock: number;
  soldCount: number;
  rating: number;
  images: string[];
  isFeatured: boolean;
}

export interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;

  fetchAllProductsForAdmin: () => Promise<void>;
  createProduct: (productData: FormData) => Promise<Product | null>;
  updateProduct: (id: string, productData: FormData) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProductById: (id: string) => Promise<Product | null>;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchAllProductsForAdmin: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_ROUTES.PRODUCTS}/fetch-admin-products`,
        {
          withCredentials: true,
        }
      );

      set({ products: response.data, isLoading: false });
    } catch (error) {
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.error
          : "Failed to fetch product",
        isLoading: false,
      });
    }
  },
  createProduct: async (productData: FormData) => {
    set({ isLoading: true });
    try {
      const resposne = await axios.post(
        `${API_ROUTES.PRODUCTS}/create-new-product`,
        productData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      set({ isLoading: false });
      return resposne.data;
    } catch (error) {
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.error
          : "Failed to create product",
        isLoading: false,
      });
      return null;
    }
  },
  updateProduct: async (id: string, productData: FormData) => {
    set({ isLoading: true });
    try {
      await axios.put(`${API_ROUTES.PRODUCTS}/${id}`, productData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      set({ isLoading: false });
    } catch (error) {
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.error
          : "Failed to update product",
        isLoading: false,
      });
    }
  },
  deleteProduct: async (id: string) => {
    set({ isLoading: true });
    try {
      await axios.delete(`${API_ROUTES.PRODUCTS}/${id}`, {
        withCredentials: true,
      });

      set({ isLoading: false });
    } catch (error) {
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.error
          : "Failed to delete product",
        isLoading: false,
      });
    }
  },
  getProductById: async (id: string) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${API_ROUTES.PRODUCTS}/${id}`, {
        withCredentials: true,
      });
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.error
          : "Failed to fetch product details",
        isLoading: false,
      });
    }
  },
}));
