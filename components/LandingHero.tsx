"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import BrutalistCanvas from "./BrutalistCanvas";

export default function LandingHero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(badgeRef.current, {
        y: -25,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
      gsap.from(headlineRef.current, {
        y: 35,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: "power4.out",
      });
      gsap.from(ctaRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.8,
        delay: 0.5,
        ease: "power3.out",
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[85vh] sm:min-h-[90vh] flex flex-col justify-center px-4 sm:px-6 lg:px-8 border-b border-[#7a07c5] overflow-hidden"
    >
      {/* 3D Wireframe Canvas ONLY for landing page */}
      <BrutalistCanvas />

      {/* Grid pattern */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10 py-12 sm:py-16">
        {/* Top Tag */}
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 bg-[#120024] border border-[#a600ff] text-[11px] sm:text-xs font-mono text-[#c466ff] mb-6 sm:mb-8 shadow-[3px_3px_0px_#7a07c5]"
        >
          <span className="truncate">
            AUTONOMOUS INTEGRATION RUNTIME // SELF-HEALING ENGINE
          </span>
        </div>

        {/* Brutalist Title */}
        <h1
          ref={headlineRef}
          className="text-3xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[1] sm:leading-[0.95] font-mono text-white mb-6 sm:mb-8"
        >
          AUTONOMOUS <br />
          <span className="text-[#c466ff] bg-[#1a0033] px-2 sm:px-3 py-1 border-2 border-[#a600ff] inline-block my-1 shadow-[3px_3px_0px_#7a07c5] sm:shadow-[5px_5px_0px_#7a07c5]">
            INTEGRATION
          </span>{" "}
          <br />
          ENGINEERING<span className="text-[#a600ff]">.</span>
        </h1>

        <p className="text-xs sm:text-base lg:text-lg text-zinc-300 font-mono max-w-2xl mb-8 sm:mb-10 leading-relaxed">
          Oplink connects disconnected business SaaS tools, automatically
          generates schema mappings via{" "}
          <strong className="text-white">Nebius Token Factory</strong>, enriches
          accounts with real-time{" "}
          <strong className="text-white">Crustdata Intelligence</strong>,
          self-heals broken schemas, and proves business ROI through auditable{" "}
          <strong className="text-white">neatlogs</strong> telemetry.
        </p>

        {/* CTA Buttons */}
        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-12 sm:mb-16"
        >
          <Link
            href="/pipeline"
            className="px-5 sm:px-6 py-3.5 sm:py-4 bg-[#a600ff] hover:bg-[#c466ff] text-black font-black uppercase text-xs sm:text-sm font-mono tracking-wider transition-all flex items-center justify-center gap-2 border-2 border-white shadow-[4px_4px_0px_#7a07c5] hover:shadow-[6px_6px_0px_white] hover:-translate-y-0.5 cursor-pointer"
          >
            <span>TEST LIVE PIPELINE RUN</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/self-healing"
            className="px-5 sm:px-6 py-3.5 sm:py-4 bg-[#0d0d0d] hover:bg-[#1a0033] text-white font-mono uppercase text-xs sm:text-sm tracking-wider transition-all flex items-center justify-center gap-2 border-2 border-[#7a07c5] hover:border-[#a600ff] shadow-[4px_4px_0px_#2e1045]"
          >
            <ShieldCheck className="w-4 h-4 text-[#c466ff]" />
            <span>INSPECT SELF-HEALING DIFF</span>
          </Link>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl">
          <div className="bg-[#0d0d0d] border border-[#7a07c5] p-3 sm:p-4">
            <div className="text-[9px] sm:text-[10px] text-zinc-400 font-mono uppercase">
              Schema Recovery Rate
            </div>
            <div className="text-base sm:text-xl font-bold text-white font-mono flex items-center gap-1.5 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#a600ff]" /> 100% PASS
            </div>
          </div>

          <div className="bg-[#0d0d0d] border border-[#7a07c5] p-3 sm:p-4">
            <div className="text-[9px] sm:text-[10px] text-zinc-400 font-mono uppercase">
              Model Runtime
            </div>
            <div className="text-base sm:text-xl font-bold text-[#c466ff] font-mono mt-1">
              Nebius 120B
            </div>
          </div>

          <div className="bg-[#0d0d0d] border border-[#7a07c5] p-3 sm:p-4">
            <div className="text-[9px] sm:text-[10px] text-zinc-400 font-mono uppercase">
              Deterministic Guard
            </div>
            <div className="text-base sm:text-xl font-bold text-white font-mono mt-1">
              Zod AST Verifier
            </div>
          </div>

          <div className="bg-[#0d0d0d] border border-[#7a07c5] p-3 sm:p-4">
            <div className="text-[9px] sm:text-[10px] text-zinc-400 font-mono uppercase">
              Telemetry Tracing
            </div>
            <div className="text-base sm:text-xl font-bold text-[#c466ff] font-mono mt-1">
              neatlogs Live
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
