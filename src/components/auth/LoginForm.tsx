
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type LoginFormProps = {
  initialRole: "athlete" | "scout" | "team" | null;
  onForgotPassword: () => void;
}

const LoginForm = ({ initialRole, onForgotPassword }: LoginFormProps) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isEmailValid = email.length > 3 && email.includes("@");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsLoading(true);
    try {
      await login(email, password, initialRole);
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="pr-10"
        />
        {isEmailValid && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
          </span>
        )}
      </div>
      <div className="relative">
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="pr-10"
        />
        <button
          type="button"
          tabIndex={-1}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          onClick={() => setShowPassword((v) => !v)}
        >
          {showPassword ? (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke="currentColor" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
          ) : (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M17.94 17.94A10.97 10.97 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.97 10.97 0 013.042-4.418M6.1 6.1A10.97 10.97 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.97 10.97 0 01-1.67 2.64M15 12a3 3 0 01-3 3m0 0a3 3 0 01-3-3m3 3l6.364 6.364M3 3l6.364 6.364"/></svg>
          )}
        </button>
      </div>
      <div className="flex justify-end">
        <button type="button" className="text-xs text-[#1877c0] hover:underline" onClick={onForgotPassword}>Forgot password?</button>
      </div>
      <Button type="submit" className="w-full bg-[#249FEE] text-white rounded-lg font-semibold hover:bg-[#1877c0] transition" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Log in"}
      </Button>
    </form>
  );
};

export default LoginForm;
