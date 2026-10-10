"use client";

import { useState } from "react";
import {
  User,
  Lock,
  Mail,
  ArrowRight,
  X,
  ShieldCheck,
  LogIn,
  UserPlus,
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
}: AuthModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const payload = isRegister
        ? { email, password, name }
        : { email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      onSuccess(data.user);
      onClose();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdmin = () => {
    setEmail("admin@oplink.ai");
    setPassword("oplink2026");
    setIsRegister(false);
    setError("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0d0d0d] border-2 border-[#a600ff] max-w-md w-full p-6 shadow-[8px_8px_0px_#7a07c5] relative font-mono text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 mb-7">
          <div className="w-7 h-7 bg-[#2a004f] border border-[#a600ff] flex items-center justify-center">
            <Lock className="w-4 h-4 text-[#c466ff]" />
          </div>
          <h2 className="text-base font-bold uppercase tracking-tight">
            {isRegister ? "CREATE OPLINK ACCOUNT" : "SIGN IN TO WORKSPACE"}
          </h2>
        </div>

        {error && (
          <div className="p-3 bg-red-950/50 border border-red-500 text-xs text-red-300 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs uppercase text-zinc-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sarah Chen"
                  className="w-full bg-[#050505] border border-[#2e1045] focus:border-[#a600ff] pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs uppercase text-zinc-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@oplink.ai"
                className="w-full bg-[#050505] border border-[#2e1045] focus:border-[#a600ff] pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase text-zinc-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#050505] border border-[#2e1045] focus:border-[#a600ff] pl-9 pr-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#a600ff] hover:bg-[#c466ff] text-black font-bold uppercase text-xs tracking-wider transition-all flex items-center justify-center gap-2 border border-white shadow-[3px_3px_0px_#7a07c5] cursor-pointer"
          >
            {loading ? (
              <span>AUTHENTICATING...</span>
            ) : isRegister ? (
              <>
                <UserPlus className="w-4 h-4" /> CREATE ACCOUNT{" "}
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" /> SIGN IN
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Credentials */}
        <div className="mt-4 pt-4 border-t border-[#2e1045] flex items-center justify-between text-xs text-zinc-400">
          <button
            type="button"
            onClick={handleDemoAdmin}
            className="text-[11px] text-[#c466ff] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" /> 1-Click Demo Admin
          </button>

          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
            className="text-[11px] text-zinc-300 hover:text-white cursor-pointer"
          >
            {isRegister
              ? "Already registered? Sign in"
              : "Need an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
}
