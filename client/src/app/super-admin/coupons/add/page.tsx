"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCouponStore } from "@/store/useCouponStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { protectCreateCouponAction } from "@/actions/coupon";

const SuperAdminManageCouponsPage = () => {
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    code: "",
    discountPercent: 0,
    usageLimit: 0,
  });

  const router = useRouter();
  const { createCoupon, isLoading } = useCouponStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreateUniqueCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";

    for (let i = 0; i < 8; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    setFormData((prevData) => ({
      ...prevData,
      code: result,
    }));
  };

  // Function to handle coupon creation
  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast("End date must be after start date");
      return;
    }

    const checkCouponFormValidation = await protectCreateCouponAction();
    if (!checkCouponFormValidation.success) {
      toast(checkCouponFormValidation.error);
      return;
    }

    const couponData = {
      ...formData,
      discountPercent: parseInt(formData.discountPercent.toString()),
      usageLimit: parseInt(formData.usageLimit.toString()),
    };

    const result = await createCoupon(couponData);

    if (result) {
      toast("Coupon created successfully!");
      router.push("/super-admin/coupons/list");
    } else {
      toast("Failed to create coupon");
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1>Create New Coupon</h1>
        </header>

        <form
          onSubmit={handleCouponSubmit}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-1"
        >
          <div className="space-y-4">
            {/* Start Date */}
            <div>
              <Label>Start Date</Label>
              <Input
                name="startDate"
                onChange={handleInputChange}
                value={formData.startDate}
                type="date"
                className="mt-1.5"
                required
              />
            </div>
            {/* End Date */}
            <div>
              <Label>End Date</Label>
              <Input
                name="endDate"
                onChange={handleInputChange}
                value={formData.endDate}
                type="date"
                className="mt-1.5"
                required
              />
            </div>
            {/* Coupon Code */}
            <div>
              <Label>Coupon Code</Label>
              <div className="flex justify-between items-center gap-2">
                <Input
                  name="code"
                  type="text"
                  className="mt-1.5"
                  placeholder="Enter Coupon Code"
                  required
                  onChange={handleInputChange}
                  value={formData.code}
                />
                <Button
                  type="button"
                  onClick={handleCreateUniqueCode}
                  className="cursor-pointer"
                >
                  Create Unique Code
                </Button>
              </div>
            </div>
            <div>
              <Label>Discount Percentage</Label>
              <Input
                type="number"
                name="discountPercent"
                className="mt-1.5"
                placeholder="Enter discount percentage"
                required
                onChange={handleInputChange}
                value={formData.discountPercent}
              />
            </div>
            <div>
              <Label>Usage Limits</Label>
              <Input
                type="number"
                name="usageLimit"
                className="mt-1.5"
                onChange={handleInputChange}
                value={formData.usageLimit}
                placeholder="Enter discount percentage"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full cursor-pointer"
            >
              {isLoading ? "Creating..." : "Create Coupon"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SuperAdminManageCouponsPage;
