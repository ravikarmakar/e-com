import express from "express";
import { authenticateJwt, isSuperAdmin } from "../middleware/authMiddleware";
import { upload } from "../middleware/uploadMiddleware";
import {
  createProduct,
  delteProduct,
  fetchAllProductForAdmin,
  getProductById,
} from "../controllers/productController";

const router = express.Router();

router.post(
  "/create-new-product",
  authenticateJwt,
  isSuperAdmin,
  upload.array("images", 5),
  createProduct
);
router.get(
  "/fetch-admin-products",
  authenticateJwt,
  isSuperAdmin,
  fetchAllProductForAdmin
);

router.get("/:id", authenticateJwt, getProductById);
router.put(
  "/:id",
  authenticateJwt,
  isSuperAdmin,
  // upload.array("images", 5),
  createProduct
);
router.delete("/:id", authenticateJwt, isSuperAdmin, delteProduct);

export default router;
