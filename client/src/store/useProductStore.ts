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
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  fetchAllProductsForAdmin: () => Promise<void>;
  createProduct: (productData: FormData) => Promise<Product | null>;
  updateProduct: (id: string, productData: FormData) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<boolean>;
  getProductById: (id: string) => Promise<Product | null>;
  fetchProductsForClient: (params: {
    page?: number;
    limit?: number;
    categories?: string[];
    sizes?: string[];
    colors?: string[];
    brands?: string[];
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) => Promise<void>;
  setCurrentPage: (page: number) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalProducts: 0,

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
      const response = await axios.put(
        `${API_ROUTES.PRODUCTS}/${id}`,
        productData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.error
          : "Failed to update product",
        isLoading: false,
      });
      return null;
    }
  },
  deleteProduct: async (id: string) => {
    set({ isLoading: true });
    try {
      const response = await axios.delete(`${API_ROUTES.PRODUCTS}/${id}`, {
        withCredentials: true,
      });

      set({ isLoading: false });
      return response.data.success;
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
  fetchProductsForClient: async (params) => {
    set({ isLoading: true, error: null });

    try {
      const queryString = {
        ...params,
        categories: params?.categories?.join(","),
        sizes: params?.sizes?.join(","),
        colors: params?.colors?.join(","),
        brands: params?.brands?.join(","),
      };

      const response = await axios.get(
        `${API_ROUTES.PRODUCTS}/fetch-client-products`,
        {
          params: queryString,
          withCredentials: true,
        }
      );

      set({
        products: response.data.products,
        totalPages: response.data.totalPage,
        totalProducts: response.data.totalProducts,
        currentPage: response.data.currentPage,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.error
          : "Failed to fetch products",
        isLoading: false,
      });
    }
  },
  setCurrentPage: (page: number) => set({ currentPage: page }),
}));
