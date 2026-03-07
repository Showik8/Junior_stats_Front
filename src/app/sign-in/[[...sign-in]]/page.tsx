"use client";

import Link from "next/link";
import { useState } from "react";
import axiosInstance from "@/app/utils/axios";
import { API_PATHS } from "@/app/utils/apiPaths";
import { setToken, setRefreshToken, setUserRole } from "@/app/utils/auth";
import { useRouter } from 'next/navigation'

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axiosInstance.post<{
        success: boolean;
        data?: { accessToken: string; refreshToken: string; role: string };
        error?: { message: string };
      }>(API_PATHS.ADMIN.LOGIN, { email, password });

      if (response.data.success && response.data.data) {
        const { accessToken, refreshToken, role } = response.data.data;
        setToken(accessToken);
        setRefreshToken(refreshToken);
        if (role) setUserRole(role);
        router.push("/admin");
      } else {
        const errorMessage = response.data.error?.message || "Login failed";
        alert(errorMessage);
      }
    } catch (error: unknown) {
      console.error("Login failed:", error);
      const errorMessage = (error as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message || (error as Error)?.message || "Login failed. Please try again.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* Header Section */}
        <div className="p-8 text-center sm:p-10">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-500 text-sm">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Form Section */}
        <div className="px-8 pb-8 sm:px-10 sm:pb-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-semibold text-gray-700 mb-1.5"
              >
                Email Address
              </label>
              <input

                id="email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                placeholder="name@example.com"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label 
                  htmlFor="password" 
                  className="block text-sm font-semibold text-gray-700"
                >
                  Password
                </label>
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors inline-flex items-center gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}