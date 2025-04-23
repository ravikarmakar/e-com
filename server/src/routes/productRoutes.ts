import express from "express";
import { authenticateJwt, isSuperAdmin } from "../middleware/authMiddleware";
import { upload } from "../middleware/uploadMiddleware";
import {
  createProduct,
  delteProduct,
  fetchAllProductForAdmin,
  getProductById,
  updateProduct,
  getProductForClient,
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
router.put(
  "/:id",
  authenticateJwt,
  isSuperAdmin,
  // upload.array("images", 5),
  updateProduct
);
router.get("/fetch-client-products", authenticateJwt, getProductForClient);
router.get("/:id", authenticateJwt, getProductById);
router.delete("/:id", authenticateJwt, isSuperAdmin, delteProduct);

export default router;
