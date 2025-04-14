"use client";

import Image from "next/image";
import banner from "../../../../public/images/banner2.jpg";
import logo from "../../../../public/images/logo1.png";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { protectSignUpAction } from "@/actions/auth";
import { toast } from "sonner";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const checkFirstLevelOfValidation = await protectSignUpAction(
      formData.email
    );
    if (!checkFirstLevelOfValidation.success) {
      toast.error(checkFirstLevelOfValidation.error || "Something went wrong!");
      return;
    }

    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen bg-[#fff6f4] flex">
      <div className="hidden lg:block w-1/2 bg-[#ffede1] relative overflow-hidden">
        <Image
          src={banner}
          alt="Register"
          fill
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
          priority
        />
      </div>
      <div className="w-full lg:w-1/2 flex flex-col p-8 lg:p-16 justify-center">
        <div className="max-w-md w-full mx-auto">
          <div className="flex justify-center">
            <Image src={logo} alt="Logo" width={200} height={50} />
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                required
                className="bg-[#ffede1]"
                onChange={handleChange}
                value={formData.name}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
                className="bg-[#ffede1]"
                onChange={handleChange}
                value={formData.email}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="text"
                placeholder="Enter your password"
                required
                className="bg-[#ffede1]"
                onChange={handleChange}
                value={formData.password}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-black transition-colors cursor-pointer"
            >
              Create Account
            </Button>
            <p className="text-center text-[#3a3d56] text-sm">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-[#111] font-bold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
