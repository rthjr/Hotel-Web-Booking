"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "@node_modules/next/link";
import { authService } from "@/lib/authService";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate passwords match
    if (formData.password !== formData.password_confirmation) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const result = await authService.register(formData);
      
      if (result.success) {
        router.push('/login'); // Redirect to login page after successful registration
      } else {
        setError(result.error || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      setError(error.message || "An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="font-[sans-serif] max-sm:px-4">
        <div className="min-h-screen flex flex-col items-center justify-center">
          <div className="grid md:grid-cols-2 items-center gap-4 max-md:gap-8 max-w-6xl max-md:max-w-lg w-full p-4 m-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md">
            <div className="md:max-w-md w-full px-4 py-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-12">
                  <h3 className="text-gray-800 text-3xl font-extrabold">
                    Sign up
                  </h3>
                  <p className="text-sm mt-4 text-gray-800">
                    Already have an account{" "}
                    <Link
                      href="/login"
                      className="text-textColor font-semibold hover:underline ml-1 whitespace-nowrap"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>

                <div>
                  <label className="text-gray-800 text-xs block mb-2">
                    Full Name
                  </label>
                  <div className="relative flex items-center">
                    <input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 pl-2 pr-8 py-3 outline-none"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <label className="text-gray-800 text-xs block mb-2">
                    Email
                  </label>
                  <div className="relative flex items-center">
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 pl-2 pr-8 py-3 outline-none"
                      placeholder="Enter email"
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <label className="text-gray-800 text-xs block mb-2">
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <input
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 pl-2 pr-8 py-3 outline-none"
                      placeholder="Enter password"
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <label className="text-gray-800 text-xs block mb-2">
                    Confirm Password
                  </label>
                  <div className="relative flex items-center">
                    <input
                      name="password_confirmation"
                      type="password"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 pl-2 pr-8 py-3 outline-none"
                      placeholder="Confirm password"
                    />
                  </div>
                </div>

                <div className="mt-12">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full shadow-xl py-2.5 px-4 text-sm tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                  </button>
                </div>

                {error && (
                  <div className="text-center text-red-600 font-medium mt-4">
                    {error}
                  </div>
                )}
              </form>
            </div>

            <div className="w-full h-full flex items-center bg-[#000842] rounded-xl p-8">
              <img
                src="https://readymadeui.com/signin-image.webp"
                className="w-full aspect-[12/12] object-contain"
                alt="signup-image"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
