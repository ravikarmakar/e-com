import { Response } from "express";
import { AuthanticatedRequest } from "../middleware/authMiddleware";
import cloudinary from "../config/cloudinary";
import { prisma } from "../server";
import fs from "fs";

// create new product
export const createProduct = async (
  req: AuthanticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      brand,
      description,
      category,
      gender,
      sizes,
      colors,
      price,
      stock,
    } = req.body;

    const files = req.files as Express.Multer.File[];

    // upload all image to cloudinary
    const uploadImages = files.map((file) =>
      cloudinary.uploader.upload(file.path, {
        folder: "ecommerce",
      })
    );

    const uploadResults = await Promise.all(uploadImages);
    const imageUrls = uploadResults.map((result) => result.secure_url);

    // create product
    const newProduct = await prisma.product.create({
      data: {
        name,
        brand,
        description,
        category,
        gender,
        sizes: sizes.split(","),
        colors: colors.split(","),
        price: parseFloat(price),
        stock: parseInt(stock),
        images: imageUrls,
        soldCount: 0,
        rating: 0,
      },
    });

    // clean up the uploaded files
    files.forEach((file) => fs.unlinkSync(file.path));
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error in creating product:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

// fetch all products for admin
export const fetchAllProductForAdmin = async (
  req: AuthanticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const fetchAllProducts = await prisma.product.findMany();
    res.status(200).json(fetchAllProducts);
  } catch (error) {
    console.error("Error in fetching product for admin:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

// get a single product
export const getProductById = async (
  req: AuthanticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error in fetching product details:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

// update a product (admin)
export const updateProduct = async (
  req: AuthanticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      name,
      brand,
      description,
      category,
      gender,
      sizes,
      colors,
      price,
      stock,
      rating,
    } = req.body;

    // const files = req.files as Express.Multer.File[];
    // // upload all image to cloudinary
    // const uploadImages = files.map((file) =>
    //   cloudinary.uploader.upload(file.path, {
    //     folder: "ecommerce",
    //   })
    // );

    // const uploadResults = await Promise.all(uploadImages);
    // const imageUrls = uploadResults.map((result) => result.secure_url);

    // update product
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        brand,
        description,
        category,
        gender,
        sizes: sizes.split(","),
        colors: colors.split(","),
        price: parseFloat(price),
        stock: parseInt(stock),
        rating: parseFloat(rating),
      },
    });

    // clean up the uploaded files
    // files.forEach((file) => fs.unlinkSync(file.path));
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error in updating product by admin:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

// delete a product (admin)
export const delteProduct = async (
  req: AuthanticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id },
    });
    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully!" });
  } catch (error) {
    console.error("Error in deleting product by admin:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

// fetch product with filter (client)
// export const fetchAllProductForAdmin = async (
//   req: AuthanticatedRequest,
//   res: Response
// ): Promise<void> => {
//   try {
//   } catch (error) {
//     console.error("Error in fetching product for admin:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error!",
//     });
//   }
// };
