"use server";

import { createCouponRules } from "@/arcjet";
import { request } from "@arcjet/next";

export const protectCreateCouponAction = async () => {
  const req = await request();
  const decision = await createCouponRules.protect(req);

  if (decision.isDenied()) {
    if (decision.reason.isBot()) {
      return {
        error: "Bot detected! Please try again.",
        success: false,
        status: 403,
      };
    } else if (decision.reason.isRateLimit()) {
      return {
        error: "Too many requests! Please try again later.",
        success: false,
        status: 403,
      };
    } else if (decision.reason.isShield()) {
      return {
        error: "Invalid activity detected! Please try again.",
        success: false,
        status: 403,
      };
    } else if (decision.reason.isSensitiveInfo()) {
      return {
        error: "Bad request - sensitive information detected",
        success: false,
        status: 400,
      };
    }
  }

  return {
    success: true,
  };
};
