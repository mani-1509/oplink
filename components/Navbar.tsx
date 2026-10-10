"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  Activity,
  ShieldCheck,
  Terminal,
  DollarSign,
  ArrowRight,
  Menu,
  X,
  User,
  LogOut,
  Layers,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import AuthModal from "./AuthModal";

interface NavbarProps {
  variant?: "landing" | "dashboard";
}

export default function Navbar({ variant = "landing" }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const {
    user,
    logout,
    openAuthModal,
    closeAuthModal,
    isAuthModalOpen,
    login,
  } = useAuth();

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#7a07c5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo & Title */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 bg-[#140026] border border-[#a600ff] flex items-center justify-center p-1 shadow-[2px_2px_0px_#7a07c5]">
              <Image
                src="/oplink.png"
                alt="OPLINK Logo"
                width={32}
                height={32}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-mono font-black text-lg sm:text-xl tracking-tighter text-white group-hover:text-[#c466ff] transition-colors">
                  OPLINK
                </span>
                <span className="hidden sm:inline-block text-[9px] font-mono px-1.5 py-0.2 bg-[#120024] border border-[#7a07c5] text-[#c466ff]">
                  v2.4
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 sm:gap-1.5">
            <Link
              href="/workspace"
              className={`px-3 py-1.5 text-xs font-mono uppercase transition-all flex items-center gap-1.5 border ${
                isActive("/workspace")
                  ? "bg-[#1c0033] text-white border-[#a600ff] shadow-[2px_2px_0px_#7a07c5]"
                  : "bg-[#0d0d0d] text-zinc-300 border-[#7a07c5]/50 hover:border-[#a600ff] hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#c466ff]" />
              <span>Workspace</span>
            </Link>

            <Link
              href="/pipeline"
              className={`px-3 py-1.5 text-xs font-mono uppercase transition-all flex items-center gap-1.5 border ${
                isActive("/pipeline")
                  ? "bg-[#1c0033] text-white border-[#a600ff] shadow-[2px_2px_0px_#7a07c5]"
                  : "bg-[#0d0d0d] text-zinc-300 border-[#7a07c5]/50 hover:border-[#a600ff] hover:text-white"
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-[#c466ff]" />
              <span>Pipeline</span>
            </Link>

            <Link
              href="/self-healing"
              className={`px-3 py-1.5 text-xs font-mono uppercase transition-all flex items-center gap-1.5 border ${
                isActive("/self-healing")
                  ? "bg-[#1c0033] text-white border-[#a600ff] shadow-[2px_2px_0px_#7a07c5]"
                  : "bg-[#0d0d0d] text-zinc-300 border-[#7a07c5]/50 hover:border-[#a600ff] hover:text-white"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#c466ff]" />
              <span>Self-Healing</span>
            </Link>

            <Link
              href="/evidence"
              className={`px-3 py-1.5 text-xs font-mono uppercase transition-all flex items-center gap-1.5 border ${
                isActive("/evidence")
                  ? "bg-[#1c0033] text-white border-[#a600ff] shadow-[2px_2px_0px_#7a07c5]"
                  : "bg-[#0d0d0d] text-zinc-300 border-[#7a07c5]/50 hover:border-[#a600ff] hover:text-white"
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-[#c466ff]" />
              <span>Telemetry</span>
            </Link>

            <Link
              href="/economics"
              className={`px-3 py-1.5 text-xs font-mono uppercase transition-all flex items-center gap-1.5 border ${
                isActive("/economics")
                  ? "bg-[#1c0033] text-white border-[#a600ff] shadow-[2px_2px_0px_#7a07c5]"
                  : "bg-[#0d0d0d] text-zinc-300 border-[#7a07c5]/50 hover:border-[#a600ff] hover:text-white"
              }`}
            >
              <DollarSign className="w-3.5 h-3.5 text-[#c466ff]" />
              <span>cfo.ai ROI</span>
            </Link>

            {/* Auth / Guest Profile Area */}
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-[#2e1045]">
              {user ? (
                /* Authenticated State */
                <div className="flex items-center gap-2 border border-[#a600ff] bg-[#140026] px-2.5 py-1 text-xs font-mono shadow-[2px_2px_0px_#7a07c5]">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-white font-bold max-w-[110px] truncate">
                    {user.name}
                  </span>
                  <span className="text-[9px] uppercase px-1 py-0.2 bg-[#2a004f] text-[#c466ff] border border-[#7a07c5]">
                    {user.role}
                  </span>
                  <button
                    onClick={logout}
                    title="Sign Out"
                    className="ml-1 text-zinc-400 hover:text-red-400 cursor-pointer transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                /* Guest / Pre-Auth State */
                <div className="flex items-center gap-1.5">
                  <span className="hidden xl:inline-block text-[10px] text-zinc-400 font-mono px-2 py-0.5 bg-[#0d0d0d] border border-[#2e1045]">
                    Guest Mode
                  </span>
                  <button
                    onClick={openAuthModal}
                    className="px-3 py-1.5 text-xs font-mono uppercase transition-all flex items-center gap-1.5 border bg-[#140026] text-[#c466ff] border-[#a600ff] hover:bg-[#a600ff] hover:text-black cursor-pointer shadow-[2px_2px_0px_#7a07c5]"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>
                </div>
              )}

              {variant === "landing" && (
                <Link
                  href="/workspace"
                  className="ml-1 px-3.5 py-1.5 text-xs font-mono font-bold uppercase bg-[#a600ff] hover:bg-[#c466ff] text-black transition-all border border-white shadow-[2px_2px_0px_#7a07c5] flex items-center gap-1"
                >
                  <span>LAUNCH APP</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </nav>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 lg:hidden">
            {user ? (
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-white max-w-[80px] truncate">
                  {user.name}
                </span>
                <button
                  onClick={logout}
                  className="px-2 py-1 bg-[#140026] border border-[#a600ff] text-red-400 text-[10px] font-mono cursor-pointer"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="px-2.5 py-1 bg-[#140026] border border-[#a600ff] text-[#c466ff] text-[11px] font-mono font-bold cursor-pointer"
              >
                SIGN IN
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 bg-[#120024] border border-[#a600ff] text-[#c466ff] focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0d0d0d] border-b-2 border-[#a600ff] p-4 space-y-2 font-mono">
            {/* Status bar */}
            <div className="p-2 bg-[#120024] border border-[#7a07c5] text-[11px] flex items-center justify-between text-zinc-300 mb-3">
              <span>Status: {user ? `Authenticated (${user.email})` : "Guest Explorer"}</span>
              <span className="text-[#c466ff] font-bold">{user ? "ONLINE" : "READ-ONLY"}</span>
            </div>

            <Link
              href="/workspace"
              onClick={() => setMobileMenuOpen(false)}
              className={`block p-3 border text-xs uppercase flex items-center justify-between ${
                isActive("/workspace")
                  ? "bg-[#1c0033] border-[#a600ff] text-white"
                  : "bg-[#140026] border-[#7a07c5] text-zinc-300"
              }`}
            >
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#a600ff]" /> 01. Workspace Hub
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#c466ff]" />
            </Link>

            <Link
              href="/pipeline"
              onClick={() => setMobileMenuOpen(false)}
              className={`block p-3 border text-xs uppercase flex items-center justify-between ${
                isActive("/pipeline")
                  ? "bg-[#1c0033] border-[#a600ff] text-white"
                  : "bg-[#140026] border-[#7a07c5] text-zinc-300"
              }`}
            >
              <span className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#a600ff]" /> 02. Live Pipeline Runner
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#c466ff]" />
            </Link>

            <Link
              href="/self-healing"
              onClick={() => setMobileMenuOpen(false)}
              className={`block p-3 border text-xs uppercase flex items-center justify-between ${
                isActive("/self-healing")
                  ? "bg-[#1c0033] border-[#a600ff] text-white"
                  : "bg-[#140026] border-[#7a07c5] text-zinc-300"
              }`}
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#a600ff]" /> 03. Self-Healing Diff
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#c466ff]" />
            </Link>

            <Link
              href="/evidence"
              onClick={() => setMobileMenuOpen(false)}
              className={`block p-3 border text-xs uppercase flex items-center justify-between ${
                isActive("/evidence")
                  ? "bg-[#1c0033] border-[#a600ff] text-white"
                  : "bg-[#140026] border-[#7a07c5] text-zinc-300"
              }`}
            >
              <span className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#a600ff]" /> 04. neatlogs Telemetry
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#c466ff]" />
            </Link>

            <Link
              href="/economics"
              onClick={() => setMobileMenuOpen(false)}
              className={`block p-3 border text-xs uppercase flex items-center justify-between ${
                isActive("/economics")
                  ? "bg-[#1c0033] border-[#a600ff] text-white"
                  : "bg-[#140026] border-[#7a07c5] text-zinc-300"
              }`}
            >
              <span className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#a600ff]" /> 05. cfo.ai Unit Economics
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#c466ff]" />
            </Link>
          </div>
        )}
      </header>

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        onSuccess={login}
      />
    </>
  );
}
