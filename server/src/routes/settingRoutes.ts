import express from "express";
import { authenticateJwt, isSuperAdmin } from "../middleware/authMiddleware";
import { upload } from "../middleware/uploadMiddleware";
import {
  addFeatureBanners,
  fetchFeatureBanners,
  updateFeaturedProducts,
  fetchFeaturedProducts,
} from "../controllers/settingController";

const router = express.Router();

router.post(
  "/banners",
  authenticateJwt,
  isSuperAdmin,
  upload.array("banner", 5),
  addFeatureBanners
);
router.get("/get-banners", authenticateJwt, fetchFeatureBanners);
router.post(
  "/update-featured-products",
  authenticateJwt,
  isSuperAdmin,
  updateFeaturedProducts
);
router.get("/fetch-featured-products", authenticateJwt, fetchFeaturedProducts);

export default router;
