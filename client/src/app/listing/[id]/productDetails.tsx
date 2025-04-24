/* eslint-disable @next/next/no-img-element */
"use client";

import { useProductStore } from "@/store/useProductStore";
import { useEffect, useState } from "react";
import { Product } from "../../../store/useProductStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProductDetailsContent = ({ id }: { id: string }) => {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);

  const { getProductById, isLoading } = useProductStore();

  useEffect(() => {
    const fetchProduct = async () => {
      const productData = await getProductById(id);
      if (productData) {
        setProduct(productData);
      } else {
        router.push("/404");
      }
    };

    fetchProduct();
  }, [id, getProductById, router]);

  if (!product || isLoading) return null;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Product Overview */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Images Container */}
          <div className="lg:w-2/3 flex gap-4">
            {/* All Images */}
            <div className="hidden lg:flex flex-col gap-2 w-24">
              {product?.images.map((image: string, index: number) => (
                <button
                  // onClick={() => setSelectedImage(index)}
                  key={index}
                  // className={`${
                  //   selectedImage === index
                  //     ? "border-black"
                  //     : "border-transparent"
                  // } border-2`}
                >
                  <img
                    src={image}
                    alt={`Product-${index + 1}`}
                    className="w-full aspect-square object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 relative w-[300px]">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/*Product Overview */}
          <div className="lg:w-1/3 space-y-6">
            {/* Price */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div>
                <span className="text-2xl font-semibold">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Colors */}
            <div>
              <h3 className="font-medium mb-2">Color</h3>
              <div className="flex gap-2">
                {product.colors.map((color: string, index: number) => (
                  <button
                    key={index}
                    className={`w-12 h-12 rounded-full border-2`}
                    // className={`w-12 h-12 rounded-full border-2 ${
                    //   selectedColor === index
                    //     ? "border-black"
                    //     : "border-gray-300"
                    // }`}
                    style={{ backgroundColor: color }}
                    // onClick={() => setSelectedColor(index)}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="font-medium mb-2">Size</h3>
              <div className="flex gap-2">
                {product.sizes.map((size: string, index: number) => (
                  <Button
                    key={index}
                    className={`w-12 h-12`}
                    // variant={selectedSize === size ? "default" : "outline"}
                    // onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/*Quantity  */}
            <div>
              <h3 className="font-medium mb-2">Quantity</h3>
              <div className="flex items-center gap-2">
                <Button
                  // onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  variant="outline"
                >
                  -
                </Button>
                {/* <span className="w-12 text-center">{quantity}</span> */}
                <Button
                  // onClick={() => setQuantity(quantity + 1)}
                  variant="outline"
                >
                  +
                </Button>
              </div>
            </div>

            <div>
              <Button
                className={
                  "w-full bg-black text-white hover:bg-gray-800 cursor-pointer"
                }
                // onClick={handleAddToCart}
              >
                ADD TO CART
              </Button>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-16">
          <Tabs defaultValue="details">
            <TabsList className="w-full justify-start border-b">
              <TabsTrigger value="details">PRODUCT DESCRIPTION</TabsTrigger>
              <TabsTrigger value="reviews">REVIEWS</TabsTrigger>
              <TabsTrigger value="shipping">
                SHIPPING & RETURNS INFO
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-5">
              <p className="text-gray-700 mb-4">{product.description}</p>
            </TabsContent>
            <TabsContent value="reviews" className="mt-5">
              Reviews
            </TabsContent>
            <TabsContent value="shipping">
              <p className="text-gray-700 mb-4">
                Shipping and return information goes here.Please read the info
                before proceeding.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsContent;
