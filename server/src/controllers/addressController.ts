import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { prisma } from "../server";

export const createAddress = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthenticated user" });
      return;
    }

    const { name, address, city, country, postalCode, phone, isDefault } =
      req.body;

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: {
          isDefault: false,
        },
      });
    }

    const newCreatedAddress = await prisma.address.create({
      data: {
        userId,
        name,
        address,
        city,
        country,
        postalCode,
        phone,
        isDefault: isDefault || false,
      },
    });

    res.status(201).json({
      success: true,
      address: newCreatedAddress,
    });
  } catch (error) {
    console.error("Error in creating address error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getAddresses = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthenticated user" });
      return;
    }

    const fetchAllAddresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      success: true,
      address: fetchAllAddresses,
    });
  } catch (error) {
    console.error("Error in getting address error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateAddress = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthenticated user" });
      return;
    }

    const existingAddress = await prisma.address.findFirst({
      where: { id, userId },
    });
    if (!existingAddress) {
      res.status(404).json({ success: false, message: "Address not found" });
      return;
    }

    const { name, address, city, country, postalCode, phone, isDefault } =
      req.body;

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: {
          isDefault: false,
        },
      });
    }

    const updatedAddress = await prisma.address.update({
      where: { id },
      data: {
        userId,
        name,
        address,
        city,
        country,
        postalCode,
        phone,
        isDefault: isDefault || false,
      },
    });

    res.status(200).json({
      success: true,
      address: updatedAddress,
    });
  } catch (error) {
    console.error("Error in updating address error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteAddress = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthenticated user" });
      return;
    }

    const existingAddress = await prisma.address.findFirst({
      where: { id, userId },
    });
    if (!existingAddress) {
      res.status(404).json({ success: false, message: "Address not found" });
      return;
    }

    await prisma.address.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Address deleted successfully!",
    });
  } catch (error) {
    console.error("Error in deleting address error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
