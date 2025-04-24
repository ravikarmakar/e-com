import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { prisma } from "../server";

export const addToCart = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { productId, quantity, size, color } = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized! User ID is not present",
      });
      return;
    }

    if (!productId || !quantity || !size || !color) {
      res.status(400).json({
        success: false,
        message: "Product ID, quantity, size, and color are required",
      });
      return;
    }

    const cart = await prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });

    const cartItem = await prisma.cartItem.upsert({
      where: {
        cartId_productId_size_color: {
          cartId: cart.id,
          productId,
          size: size || null,
          color: color || null,
        },
      },
      update: {
        quantity: { increment: quantity },
      },
      create: {
        cartId: cart.id,
        productId,
        quantity,
        size,
        color,
      },
    });

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        name: true,
        price: true,
        images: true,
      },
    });

    const responseItem = {
      id: cartItem.id,
      productId: cartItem.productId,
      quantity: cartItem.quantity,
      size: cartItem.size,
      color: cartItem.color,
      name: product?.name,
      price: product?.price,
      images: product?.images[0],
    };

    res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      data: responseItem,
    });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add product to cart",
    });
  }
};

export const getCart = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized! User ID is not present",
      });
      return;
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: true,
      },
    });

    if (!cart) {
      res.status(404).json({
        success: false,
        message: "Cart not found",
        data: [],
      });
      return;
    }

    const cartItemsWithProducts = await Promise.all(
      cart?.items.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            name: true,
            price: true,
            images: true,
          },
        });

        return {
          id: item.id,
          productId: item.productId,
          name: product?.name,
          price: product?.price,
          image: product?.images[0],
          color: item.color,
          size: item.size,
          quantity: item.quantity,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: cartItemsWithProducts,
    });
  } catch (error) {
    console.error("Error to fetch cart:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cart!",
    });
  }
};

export const removeFromCart = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized! User ID is not present",
      });
      return;
    }

    await prisma.cartItem.delete({
      where: {
        id,
        cart: { userId },
      },
    });

    res.status(200).json({
      success: true,
      message: "Item is removed from cart",
    });
  } catch (error) {
    console.error("Error to remove from cart:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove form cart!",
    });
  }
};

export const updateCartItemQuantity = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const { quantity } = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized! User ID is not present",
      });
      return;
    }

    const updatedItem = await prisma.cartItem.update({
      where: {
        id,
        cart: { userId },
      },
      data: { quantity },
    });

    const product = await prisma.product.findUnique({
      where: { id: updatedItem.productId },
      select: {
        name: true,
        price: true,
        images: true,
      },
    });

    const responseItem = {
      id: updatedItem.id,
      productId: updatedItem.productId,
      name: product?.name,
      price: product?.price,
      image: product?.images[0],
      color: updatedItem.color,
      size: updatedItem.size,
      quantity: updatedItem.quantity,
    };

    res.json({
      success: true,
      data: responseItem,
    });
  } catch (error) {
    console.error("Error to update cart item quantity", error);
    res.status(500).json({
      success: false,
      message: "Failed to update cart item quantity!",
    });
  }
};

export const clearEntireCart = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized! User ID is not present",
      });
      return;
    }

    await prisma.cartItem.deleteMany({
      where: {
        cart: { userId },
      },
    });

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully!",
    });
  } catch (error) {
    console.error("Error to clear cart:", error);
    res.status(500).json({
      success: false,
      message: "Failed to clear cart!",
    });
  }
};
