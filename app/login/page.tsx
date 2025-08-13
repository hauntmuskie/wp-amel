"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Image from "next/image";

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
    <div className="min-h-screen flex">
      {/* Left Side - Swiss Design Visual */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-red-600 via-white to-gray-100 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <h2
            className="text-5xl font-extrabold tracking-tight text-gray-900 mb-6 uppercase"
            style={{ letterSpacing: "0.1em" }}
          >
            {/* WP-<span className="text-red-600">AMEL</span> */}
            <Image
              src="/image.png"
              alt="Logo"
              width={280}
              height={280}
              priority
              quality={100}
              className="w-full h-full"
            />
          </h2>
        </div>
        <svg
          className="absolute -top-20 -left-20 w-[500px] h-[500px] opacity-10"
          viewBox="0 0 500 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="0" y="0" width="500" height="500" rx="100" fill="#DC2626" />
        </svg>
        <svg
          className="absolute bottom-0 right-0 w-64 h-64 opacity-20"
          viewBox="0 0 256 256"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="128" cy="128" r="128" fill="#1E293B" />
        </svg>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-white">
        <div className="w-full max-w-md p-8 md:p-12 rounded-lg shadow-2xl border border-gray-100">
          <div className="mb-8">
            <h1 className="text-center text-3xl font-bold text-gray-900 tracking-wide border-b-2 border-black pb-2">
              Silahkan Masuk
            </h1>
            {/* <div className="w-56 h-1 bg-red-600 rounded-full mb-2"></div> */}
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label
                htmlFor="username"
                className="text-sm font-semibold text-gray-700"
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
                autoComplete="username"
              />
            </div>
            <div>
              <Label
                htmlFor="password"
                className="text-sm font-semibold text-gray-700"
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
                autoComplete="current-password"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg tracking-wider shadow-md transition-all"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Login"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
