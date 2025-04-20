import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import cloudinary from "../config/cloudinary";
import { prisma } from "../server";
import fs from "fs";

export const addFeatureBanners = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(400).json({
        success: false,
        message: "No files were provided",
      });
      return;
    }

    const uploadPromises = files.map((file) =>
      cloudinary.uploader.upload(file.path, {
        folder: "ecommerce-feature-banners",
      })
    );

    const uploadResults = await Promise.all(uploadPromises);

    const banners = await Promise.all(
      uploadResults.map((res) =>
        prisma.featureBanner.create({
          data: {
            imageUrl: res.secure_url,
          },
        })
      )
    );

    files.forEach((file) => fs.unlinkSync(file.path));
    res.status(201).json({
      success: true,
      message: "Feature banners added successfully",
      banners,
    });
  } catch (error) {
    console.error("Error adding feature banners:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add feature banners",
    });
  }
};

export const fetchFeatureBanners = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const banners = await prisma.featureBanner.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!banners || banners.length === 0) {
      res.status(404).json({
        success: false,
        message: "No feature banners found",
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Feature banners fetched successfully",
      banners,
    });
  } catch (error) {
    console.error("Error fetching feature banners:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetching feature banners",
    });
  }
};

export const updateFeaturedProducts = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { productIds } = req.body;

    if (!Array.isArray(productIds) || productIds.length > 8) {
      res.status(400).json({
        success: false,
        message: "Invalid product IDs",
      });
      return;
    }

    // Reset all products to not featured
    await prisma.product.updateMany({
      data: { isFeatured: false },
    });

    // Set the selected products to featured
    await prisma.product.updateMany({
      where: { id: { in: productIds } },
      data: { isFeatured: true },
    });

    res.status(200).json({
      success: true,
      message: "Featured products updated successfully",
    });
  } catch (error) {
    console.error("Error updating featured products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update featured products",
    });
  }
};

export const fetchFeaturedProducts = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const featuredProducts = await prisma.product.findMany({
      where: { isFeatured: true },
    });

    res.status(200).json({
      success: true,
      featuredProducts,
    });
  } catch (error) {
    console.error("Error get featured products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get featured products",
    });
  }
};
