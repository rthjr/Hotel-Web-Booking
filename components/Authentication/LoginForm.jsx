"use client";

/* import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "@node_modules/next/link";
import { authService } from "@/lib/authService";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await authService.login({ email, password });
      
      if (result.success) {
        
        router.push('/'); // Redirect to home page after successful login
      } else {
        setError(result.error || "Invalid credentials");
      }
    } catch (error) {
      console.error(error);
      setError(error.message || "An error occurred during login");
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
                    Sign in
                  </h3>
                  <p className="text-sm mt-4 text-gray-800">
                    Don't have an account{" "}
                    <Link
                      href="/signup"
                      className="text-textColor font-semibold hover:underline ml-1 whitespace-nowrap"
                    >
                      Register here
                    </Link>
                  </p>
                </div>

                <div>
                  <label className="text-gray-800 text-xs block mb-2">
                    Email
                  </label>
                  <div className="relative flex items-center">
                    <input
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 pl-2 pr-8 py-3 outline-none"
                      placeholder="Enter email"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#bbb"
                      stroke="#bbb"
                      className="w-[18px] h-[18px] absolute right-2"
                      viewBox="0 0 682.667 682.667"
                    >
                      <defs>
                        <clipPath id="a" clipPathUnits="userSpaceOnUse">
                          <path
                            d="M0 512h512V0H0Z"
                            data-original="#000000"
                          ></path>
                        </clipPath>
                      </defs>
                      <g
                        clipPath="url(#a)"
                        transform="matrix(1.33 0 0 -1.33 0 682.667)"
                      >
                        <path
                          fill="none"
                          strokeMiterlimit="10"
                          strokeWidth="40"
                          d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z"
                          data-original="#000000"
                        ></path>
                        <path
                          d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z"
                          data-original="#000000"
                        ></path>
                      </g>
                    </svg>
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 pl-2 pr-8 py-3 outline-none"
                      placeholder="Enter password"
                      required
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#bbb"
                      stroke="#bbb"
                      className="w-[18px] h-[18px] absolute right-2 cursor-pointer"
                      viewBox="0 0 128 128"
                    >
                      <path
                        d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                        data-original="#000000"
                      ></path>
                    </svg>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
                  <div>
                    <Link
                      href="/signup"
                      className="text-textColor font-semibold text-sm hover:underline"
                    >
                      Create Account!
                    </Link>
                  </div>
                </div>

                <div className="mt-12">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full shadow-xl py-2.5 px-4 text-sm tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Signing in..." : "Sign in"}
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
                alt="login-image"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; */

import React, { useState, useContext } from "react";
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
import { TriangleAlert, Mail, Lock } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { authService } from "@/lib/authService";
import Link from "@node_modules/next/link";
import { useAuth } from "@/Context/AuthContext/AuthContext";

const LoginForm = () => {
  const router = useRouter();
  const { handleLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPending(true);
    setError("");

    try {
      const result = await handleLogin(email, password);

      if (result.success) {
        router.push("/");
      } else {
        setError(result.error || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred during login");
    } finally {
      setPending(false);
    }
  };

  const handleProviderSignIn = (provider) => {
    setPending(true);
    console.log(`Logging in with ${provider}`);
    setTimeout(() => {
      setPending(false);
      router.push("/");
    }, 1000);
  };

  return (
    <div className="">
      <Card className="w-full max-w-[1000px] mx-auto backdrop-blur-3xl bg-zinc-50 p-8 flex space-x-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] border-none">
        <div className="w-full max-w-[400px] p-5">
          <CardHeader className="pt-0 px-0">
            <CardTitle className="text-slate-900 mb-3 text-3xl font-bold">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-slate-700 text-base">
              Sign in to access your account and continue your journey
            </CardDescription>
          </CardHeader>

          {error && (
            <div className="bg-red-50 p-4 rounded-lg flex items-center gap-x-3 text-sm text-red-600 mb-6 border border-red-100 animate-fade-in">
              <TriangleAlert className="size-5" />
              <p>{error}</p>
            </div>
          )}

          <CardContent className="space-y-6 px-0 pb-0">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/50 size-5" />
                  <Input
                    type="email"
                    disabled={pending}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="pl-10 h-12 bg-white border-muted-foreground/20 focus:border-muted-foreground focus:ring-2 focus:ring-muted-foreground/20 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/50 size-5" />
                  <Input
                    type="password"
                    disabled={pending}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="pl-10 h-12 bg-white border-muted-foreground/20 focus:border-muted-foreground focus:ring-2 focus:ring-muted-foreground/20 transition-all duration-200"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-sky-600 hover:bg-sky-600/90 text-white font-medium text-[18px] rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                size="lg"
                disabled={pending}
              >
                {pending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
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
                disabled={pending}
                onClick={() => handleProviderSignIn("google")}
                variant="outline"
                size="lg"
                className="w-full h-12 relative hover:scale-105 transition-all duration-200"
              >
                <FcGoogle className="size-5 absolute left-4" />
                <span className="ml-2 text-muted-foreground">Continue with Google</span>
              </Button>
              <Button
                disabled={pending}
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
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-sky-700 cursor-pointer hover:underline transition-colors duration-200"
              >
                Create an account
              </Link>
            </p>
          </CardContent>
        </div>
        <div className="hidden lg:block max-w-[500px] h-[600px] bg-sky-700 rounded-2xl mt-1 p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://readymadeui.com/signin-image.webp')] bg-cover bg-center opacity-90"></div>
          <div className="absolute inset-0 bg-gradient-to-t"></div>
          <div className="relative h-full flex flex-col justify-end text-white">
            <div className="backdrop-blur-sm rounded-lg p-4">
            <h2 className="text-3xl font-bold mb-4">Welcome to Our Platform</h2>
            <p className="text-lg text-neutral-50">
              Sign in to access exclusive features and manage your bookings with ease.
            </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoginForm;
