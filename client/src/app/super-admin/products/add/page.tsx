/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { protectCreateProductAction } from "@/actions/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useProductStore } from "@/store/useProductStore";
import { brands, categories, colors, Gender, sizes } from "@/utils/config";
import { Upload } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface FormState {
  name: string;
  brand: string;
  description: string;
  category: string;
  gender: string;
  price: string;
  stock: string;
}

const SuperAdminManageProductPage = () => {
  const [formState, setFormState] = useState<FormState>({
    name: "",
    brand: "",
    description: "",
    category: "",
    gender: "",
    price: "",
    stock: "",
  });

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColours, setSelectedColours] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const searchParams = useSearchParams();
  const getCurrentEditedProductId = searchParams.get("id");
  const isEditedMode = !!getCurrentEditedProductId;

  const router = useRouter();

  const { createProduct, isLoading, getProductById, updateProduct } =
    useProductStore();

  // For update product
  useEffect(() => {
    if (isEditedMode) {
      getProductById(getCurrentEditedProductId).then((product) => {
        if (product) {
          setFormState({
            name: product.name,
            brand: product.brand,
            description: product.description,
            category: product.category,
            gender: product.gender,
            price: product.price.toString(),
            stock: product.stock.toString(),
          });
          setSelectedSizes(product.sizes);
          setSelectedColours(product.colors);
        }
      });
    }
  }, [getCurrentEditedProductId, isEditedMode]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleToggleSize = (size: string) => {
    setSelectedSizes((prevSizes) =>
      prevSizes.includes(size)
        ? prevSizes.filter((s) => s !== size)
        : [...prevSizes, size]
    );
  };

  const handleToggleColor = (color: string) => {
    setSelectedColours((prevColors) =>
      prevColors.includes(color)
        ? prevColors.filter((c) => c !== color)
        : [...prevColors, color]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Bot protection
    const checkFirstLevelFormSanitization = await protectCreateProductAction();
    if (!checkFirstLevelFormSanitization.success) {
      toast(checkFirstLevelFormSanitization.error);
      return;
    }

    const formData = new FormData();
    Object.entries(formState).forEach(([key, value]) => {
      formData.append(key, value);
    });

    formData.append("sizes", selectedSizes.join(","));
    formData.append("colors", selectedColours.join(","));

    if (!isEditedMode) {
      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });
    }

    const result = isEditedMode
      ? await updateProduct(getCurrentEditedProductId, formData)
      : await createProduct(formData);

    console.log(result);
    if (result) {
      router.push("/super-admin/products/list");
    }
  };

  useEffect(() => {
    if (getCurrentEditedProductId === null) {
      setFormState({
        name: "",
        brand: "",
        description: "",
        category: "",
        gender: "",
        price: "",
        stock: "",
      });

      setSelectedSizes([]);
      setSelectedColours([]);
    }
  }, [getCurrentEditedProductId]);

  return (
    <div className="p-6">
      <div className="flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1>Add Product</h1>
        </header>
        <form
          onSubmit={handleFormSubmit}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-1"
        >
          {/* File Upload */}
          {isEditedMode ? null : (
            <div className="mt-2 w-full flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-400 p-12">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4 flex flex-col leading-6 text-gray-600">
                  <Label>
                    <span>Click to browse</span>
                    <input
                      type="file"
                      className="sr-only"
                      multiple
                      onChange={handleFileChange}
                    />
                  </Label>
                </div>
              </div>
              {selectedFiles.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <h2 className="text-sm font-semibold">Selected Files:</h2>
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="text-sm relative">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        width={80}
                        height={80}
                        className="h-20 w-20 rounded-md object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="space-y-4">
            {/* Product name */}
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                type="text"
                name="name"
                id="name"
                onChange={handleInputChange}
                value={formState.name}
                required
                className="mt-1.5"
                placeholder="Enter product name"
              />
            </div>
            {/* Product Description */}
            <div>
              <Label htmlFor="description">Product Description</Label>
              <Textarea
                name="description"
                id="description"
                onChange={handleInputChange}
                value={formState.description}
                className="mt-1.5  min-h-[150px]"
                placeholder="Enter product description"
                required
              />
            </div>
            {/* Other fileds */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Product Brand */}
              <div>
                <Label>Brand</Label>
                <Select
                  value={formState.brand}
                  onValueChange={(value) => handleSelectChange("brand", value)}
                  name="brand"
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select Brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand.toLowerCase()}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Product Category */}
              <div>
                <Label>Category</Label>
                <Select
                  value={formState.category}
                  onValueChange={(value) =>
                    handleSelectChange("category", value)
                  }
                  name="category"
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((item) => (
                      <SelectItem key={item} value={item.toLowerCase()}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Product Gender */}
              <div>
                <Label>Gender</Label>
                <Select
                  value={formState.gender}
                  onValueChange={(value) => handleSelectChange("gender", value)}
                  name="gender"
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {Gender.map((item) => (
                      <SelectItem key={item} value={item.toLowerCase()}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Product Size */}
            <div>
              <Label>Size</Label>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {sizes.map((item) => (
                  <Button
                    onClick={() => handleToggleSize(item)}
                    variant={
                      selectedSizes.includes(item) ? "default" : "outline"
                    }
                    key={item}
                    type="button"
                    size={"sm"}
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </div>
            {/* Product Color */}
            <div>
              <Label>Colors</Label>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {colors.map((color) => (
                  <Button
                    onClick={() => handleToggleColor(color.name)}
                    key={color.name}
                    type="button"
                    className={`h-8 w-8 rounded-full ml-2 ${
                      color.class
                    } border border-gray-300 cursor-pointer ${
                      selectedColours.includes(color.name)
                        ? "ring-2 ring-primary ring-offset-2"
                        : ""
                    }`}
                  />
                ))}
              </div>
            </div>
            {/* Product Price */}
            <div>
              <Label htmlFor="price">Product Price</Label>
              <Input
                name="price"
                placeholder="Enter Product Price"
                className="mt-1.5"
                onChange={handleInputChange}
                value={formState.price}
                required
              />
            </div>
            {/* Product Stock */}
            <div>
              <Label htmlFor="stock">Product Stock</Label>
              <Input
                name="stock"
                id="stock"
                placeholder="Enter Product Stock"
                className="mt-1.5"
                onChange={handleInputChange}
                value={formState.stock}
                required
              />
            </div>

            <Button
              disabled={isLoading}
              type="submit"
              className="w-full mt-1.5"
            >
              {isLoading ? "Creating..." : "Create Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SuperAdminManageProductPage;
