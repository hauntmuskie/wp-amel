"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple admin authentication
    if (formData.username === "admin" && formData.password === "admin") {
      toast.success("Login berhasil! Selamat datang Admin.");
      router.push("/admin");
    } else {
      toast.error("Username atau password salah!");
    }

    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Silahkan Masuk
          </h1>
          <div className="w-16 h-0.5 bg-gray-800 mx-auto"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label
              htmlFor="username"
              className="text-sm font-medium text-gray-700"
            >
              Username
            </Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Masukkan Username"
              className="mt-1"
              value={formData.username}
              onChange={handleInputChange}
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Masukkan Password"
              className="mt-1"
              value={formData.password}
              onChange={handleInputChange}
              disabled={isLoading}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
}
