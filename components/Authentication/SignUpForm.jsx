"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@components/ui/seperator";
import { TriangleAlert, Mail, Lock, User } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { authService } from "@/lib/authService";
import Link from "@node_modules/next/link";

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
        router.push('/login');
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

  const handleProviderSignIn = (provider) => {
    setIsLoading(true);
    console.log(`Signing up with ${provider}`);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/");
    }, 1000);
  };

  return (
    <div className="">
      <Card className="w-full max-w-[1000px] mx-auto backdrop-blur-3xl bg-zinc-50 p-8 flex space-x-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] border-none">
        <div className="w-full max-w-[400px] p-5">
          <CardHeader className="pt-0 px-0">
            <CardTitle className="text-slate-900 mb-3 text-3xl font-bold">
              Create Account
            </CardTitle>
            <CardDescription className="text-slate-700 text-base">
              Join us and start your journey with our platform
            </CardDescription>
          </CardHeader>

          {error && (
            <div className="bg-red-50 p-4 rounded-lg flex items-center gap-x-3 text-sm text-red-600 mb-6 border border-red-100 animate-fade-in">
              <TriangleAlert className="size-5" />
              <p>{error}</p>
            </div>
          )}

          <CardContent className="space-y-2 px-0 pb-0">
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="space-y-0">
                <label className="text-sm font-medium text-slate-700">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/50 size-5" />
                  <Input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    placeholder="Enter your full name"
                    className="pl-10 h-12 bg-white border-muted-foreground/20 focus:border-muted-foreground focus:ring-2 focus:ring-muted-foreground/20 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-0">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/50 size-5" />
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    placeholder="Enter your email"
                    className="pl-10 h-12 bg-white border-muted-foreground/20 focus:border-muted-foreground focus:ring-2 focus:ring-muted-foreground/20 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-0">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/50 size-5" />
                  <Input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    placeholder="Enter your password"
                    className="pl-10 h-12 bg-white border-muted-foreground/20 focus:border-muted-foreground focus:ring-2 focus:ring-muted-foreground/20 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-0">
                <label className="text-sm font-medium text-slate-700">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/50 size-5" />
                  <Input
                    name="password_confirmation"
                    type="password"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    placeholder="Confirm your password"
                    className="pl-10 h-12 bg-white border-muted-foreground/20 focus:border-muted-foreground focus:ring-2 focus:ring-muted-foreground/20 transition-all duration-200"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-sky-600 hover:bg-sky-600/90 text-white font-medium text-[18px] rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="relative">
              <Separator className="my-6" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-sm text-slate-700">
                Or continue with
              </span>
            </div>

            <div className="flex flex-col gap-y-4">
              <Button
                disabled={isLoading}
                onClick={() => handleProviderSignIn("google")}
                variant="outline"
                size="lg"
                className="w-full h-12 relative hover:scale-105 transition-all duration-200"
              >
                <FcGoogle className="size-5 absolute left-4" />
                <span className="ml-2 text-muted-foreground">Continue with Google</span>
              </Button>
              <Button
                disabled={isLoading}
                onClick={() => handleProviderSignIn("github")}
                variant="outline"
                size="lg"
                className="w-full h-12 relative hover:scale-105 transition-all duration-200"
              >
                <FaGithub className="size-5 absolute left-4" />
                <span className="ml-2 text-muted-foreground">Continue with GitHub</span>
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-sky-700 cursor-pointer hover:underline transition-colors duration-200"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </div>

        <div className="hidden lg:block max-w-[500px] h-[600px] bg-sky-700 rounded-2xl mt-12 p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://readymadeui.com/signin-image.webp')] bg-cover bg-center opacity-90"></div>
          <div className="absolute inset-0 bg-gradient-to-t"></div>
          <div className="relative h-full flex flex-col justify-end text-white">
            <div className="backdrop-blur-sm rounded-lg p-4">
              <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
              <p className="text-lg text-neutral-50">
                Create an account to access exclusive features and manage your bookings with ease.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SignUpForm;
