"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "VIEWER",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to create account");
      }
      const data = await response.json();
      console.log(data);
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 700);
    } catch (error) {
      setError(error.message);
    }
  };

  if (success) {
    return <div>Account created successfully. Please login.</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background with blur */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url(https://res.cloudinary.com/dpu6rveug/image/upload/v1765346760/ocean-group-background_bzbnm3.webp)",
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      </div>

      {/* Signup Form */}
      <div className="relative z-10 w-full max-w-lg px-6 py-10">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Create Account
            </h1>
            <p className="text-white/70 text-sm">
              Register your Oceans Marine account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Employee Name */}
            <InputField
              label="Full Name"
              name="employeeName"
              value={formData.employeeName}
              onChange={handleChange}
              placeholder="Enter full name"
            />

            {/* Employee ID */}
            <InputField
              label="Employee ID"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              placeholder="OFD-001"
            />

            {/* Email */}
            <InputField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
            />

            {/* Password */}
            <InputField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
            />

            {/* Role Dropdown */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-white/90">
                Select Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              >
                <option value="VIEWER">Viewer</option>
                <option value="REVIEWER">Reviewer</option>
                <option value="EDITOR">Editor</option>
                <option value="UPLOADER">Uploader</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-orange-500/40 transition-all"
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </button>

            <p className="text-center text-white/70 text-sm mt-4">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-orange-400 hover:text-orange-500"
              >
                Sign in
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

/*------------------------------
  InputField Component
-------------------------------*/
function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-white/90">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 
        text-white placeholder-white/50 focus:outline-none focus:ring-2 
        focus:ring-orange-500/50 transition-all"
        placeholder={placeholder}
      />
    </div>
  );
}
