"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "../ui/button";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  ListOrdered,
  LogOut,
  Package,
  Printer,
  SendToBack,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

const menuItems = [
  {
    name: "Products",
    icon: Package,
    href: "/super-admin/products/list",
  },
  {
    name: "Add new product",
    icon: Printer,
    href: "/super-admin/products/add",
  },
  {
    name: "Oders",
    icon: SendToBack,
    href: "/super-admin/oders",
  },
  {
    name: "Coupons",
    icon: FileText,
    href: "/super-admin/coupons/list",
  },
  {
    name: "Create Coupons",
    icon: ListOrdered,
    href: "/super-admin/coupons/add",
  },
  {
    name: "Settings",
    icon: Settings,
    href: "/super-admin/settings",
  },
  {
    name: "Logout",
    icon: LogOut,
    href: "",
  },
];

const SuperAdminSidebar = ({ isOpen, toggle }: SidebarProps) => {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-background transition-all duration-300",
        isOpen ? "w-64" : "w-16",
        "border-r"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <h1 className={cn("font-semibold", !isOpen && "hidden")}>
          Admin Pannel
        </h1>

        <Button
          variant={"ghost"}
          onClick={toggle}
          size={"icon"}
          className="ml-auto"
        >
          {isOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="space-y-4 py-4">
        {menuItems.map((item) => (
          <div
            onClick={
              item.name === "Logout"
                ? handleLogout
                : () => router.push(item.href)
            }
            key={item.name}
            className={cn(
              "flex items-center py-2 px-4 text-sm hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer"
            )}
          >
            <item.icon className="h-4 w-4" />
            <span className={cn("ml-3", !isOpen && "hidden")}>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuperAdminSidebar;
