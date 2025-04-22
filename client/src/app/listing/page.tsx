"use client";

import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { brands, categories, colors, sizes } from "@/utils/config";
import { SlidersHorizontal } from "lucide-react";
import Image from "next/image";
// import { useRouter } from "next/navigation";
import { useState } from "react";

const ProductListingPage = () => {
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // const router = useRouter();

  const handleSortChange = (value: string) => {
    console.log(value);
    const [newSortBy, newSortOrder] = value.split("-");
    setSortBy(newSortBy);
    setSortOrder(newSortOrder as "asc" | "desc");
  };

  const handleToggleFilter = (
    filterType: "categories" | "sizes" | "brands" | "colors",
    value: string
  ) => {
    const setterMap = {
      categories: setSelectedCategories,
      sizes: setSelectedSizes,
      brands: setSelectedBrands,
      colors: setSelectedColors,
    };

    setterMap[filterType]((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const FilterSection = () => {
    return (
      <div className="space-y-6">
        {/* Categories */}
        <div>
          <h3 className="mb-3 font-semibold">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center">
                <Checkbox
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() =>
                    handleToggleFilter("categories", category)
                  }
                  id={category}
                />
                <Label htmlFor={category} className="ml-2 text-sm">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Brands */}
        <div>
          <h3 className="mb-3 font-semibold">Brands</h3>
          <div className="space-y-2">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center">
                <Checkbox
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={() => handleToggleFilter("brands", brand)}
                  id={brand}
                />
                <Label htmlFor={brand} className="ml-2 text-sm">
                  {brand}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Sizes */}
        <div>
          <h3 className="mb-3 font-semibold">Size</h3>
          <div className="flex flex-wrap gap-2">
            {sizes.map((sizeItem) => (
              <Button
                key={sizeItem}
                variant={
                  selectedSizes.includes(sizeItem) ? "default" : "outline"
                }
                onClick={() => handleToggleFilter("sizes", sizeItem)}
                className="h-8 w-8"
                size="sm"
              >
                {sizeItem}
              </Button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div>
          <h3 className="mb-3 font-semibold">Colors</h3>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color.name}
                className={`w-6 h-6 rounded-full ${color.class} ${
                  selectedColors.includes(color.name)
                    ? "ring-offset-2 ring-black ring-2"
                    : ""
                }`}
                title={color.name}
                onClick={() => handleToggleFilter("colors", color.name)}
              />
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="mb-3 font-semibold">Price range</h3>
          <Slider
            defaultValue={[0, 100000]}
            max={100000}
            step={1}
            className="w-full"
            value={priceRange}
            onValueChange={(value) => setPriceRange(value)}
          />
          <div className="flex justify-between mt-2 text-sm">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="relative h-[300px] overflow-hidden">
        <Image
          fill
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop"
          alt="Listing Page Banner"
          className="w-full object-cover h-full "
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-2">HOT COLLECTION</h1>
            <p className="text-lg">Discover our latest collection</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold">All Products</h2>
          <div className="flex items-center gap-4">
            {/* Mobile filter render */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant={"outline"} className="lg:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90vw] max-h-[600px] overflow-auto max-w-[400px]">
                <AlertDialogHeader>
                  <DialogTitle>Filters</DialogTitle>
                </AlertDialogHeader>
                <FilterSection />
              </DialogContent>
            </Dialog>

            {/* DeskTop View */}
            <Select
              value={`${sortBy}-${sortOrder}`}
              onValueChange={(value) => handleSortChange(value)}
              name="sort"
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select Brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-asc">Sort by: Featured</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price : High to Low</SelectItem>
                <SelectItem value="createdAt-desc">
                  Sort by: Newest First
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-8">
          <div className="hidden lg:block w-64 flex-shrink-0">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>
            <FilterSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;
