import { API_ROUTES } from "@/utils/api";
import axios from "axios";
import { create } from "zustand";

export interface Address {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}

interface AddressStore {
  addresses: Address[];
  isLoading: boolean;
  error: string | null;
  fetchAddresses: () => Promise<void>;
  createAddress: (address: Omit<Address, "id">) => Promise<Address | null>;
  updateAddress: (
    id: string,
    address: Partial<Address>
  ) => Promise<Address | null>;
  deleteAddress: (id: string) => Promise<boolean>;
}

export const useAddressStore = create<AddressStore>((set) => ({
  addresses: [],
  isLoading: false,
  error: null,
  fetchAddresses: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_ROUTES.ADDRESS}/get-address`, {
        withCredentials: true,
      });
      set({ addresses: response.data.address, isLoading: false });
    } catch (error) {
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.error
          : "failed to fetch address",
        isLoading: false,
      });
    }
  },
  createAddress: async (address) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${API_ROUTES.ADDRESS}/add-address`,
        address,
        {
          withCredentials: true,
        }
      );

      const newAddress = response.data.address;

      set((state) => ({
        addresses: [newAddress, ...state.addresses],
        isLoading: false,
      }));

      return newAddress;
    } catch (error) {
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.error
          : "failed to createing address",
        isLoading: false,
      });
      return null;
    }
  },
  updateAddress: async (id, address) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(
        `${API_ROUTES.ADDRESS}/update-address/${id}`,
        address,
        { withCredentials: true }
      );

      const updatedAddress = response.data.address;

      set((state) => ({
        addresses: state.addresses.map((item) =>
          item.id === id ? updatedAddress : item
        ),
        isLoading: false,
      }));

      return updatedAddress;
    } catch (error) {
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.error
          : "failed to updating address",
        isLoading: false,
      });
      return null;
    }
  },
  deleteAddress: async (id) => {
    try {
      await axios.delete(`${API_ROUTES.ADDRESS}/delete-address/${id}`, {
        withCredentials: true,
      });

      set((state) => ({
        addresses: state.addresses.filter((item) => item.id !== id),
        isLoading: false,
      }));
      return true;
    } catch (error) {
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.error
          : "failed to daleting address",
        isLoading: false,
      });
      return false;
    }
  },
}));
