import Navbar from "@/components/Navbar";
import LandingHero from "@/components/LandingHero";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import DemoPreview from "@/components/DemoPreview";
import FaqSection from "@/components/FaqSection";
import Link from "next/link";
import { ArrowRight, Cpu, Layers } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white selection:bg-[#a600ff] selection:text-black">
      {/* Brutalist Navbar */}
      <Navbar variant="landing" />

      {/* Hero with 3D Wireframe Canvas & GSAP Animations */}
      <LandingHero />

      {/* Architecture & Data Flow */}
      <ArchitectureDiagram />

      {/* Demo Execution Walkthrough */}
      <DemoPreview />

      {/* Technical FAQ */}
      <FaqSection />

      {/* Bottom CTA Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#120024] border-b border-[#7a07c5] text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black font-mono uppercase text-white tracking-tight mb-4">
            READY TO RUN AUTONOMOUS INTEGRATIONS?
          </h2>
          <p className="text-xs sm:text-sm font-mono text-zinc-300 mb-8 max-w-xl mx-auto">
            Experience the live pipeline runner, test schema break recovery, and
            inspect neatlogs telemetry in real time.
          </p>
          <Link
            href="/pipeline"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#a600ff] hover:bg-[#c466ff] text-black font-mono font-bold text-sm uppercase border-2 border-white shadow-[6px_6px_0px_#7a07c5] transition-all hover:translate-x-1 hover:translate-y-1 cursor-pointer"
          >
            <span>LAUNCH PIPELINE RUNNER</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Brutalist Footer */}
      <footer className="border-t border-[#7a07c5] bg-[#070707] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 bg-[#140026] border border-[#a600ff] flex items-center justify-center p-0.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/oplink.png" alt="OPLINK" className="w-4 h-4 object-contain" />
            </div>
            <span>OPLINK // AUTONOMOUS INTEGRATION RUNTIME</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[11px]">
            <Link href="/pipeline" className="hover:text-[#c466ff]">
              Pipeline
            </Link>
            <Link href="/self-healing" className="hover:text-[#c466ff]">
              Self-Healing
            </Link>
            <Link href="/evidence" className="hover:text-[#c466ff]">
              Telemetry
            </Link>
            <Link href="/economics" className="hover:text-[#c466ff]">
              cfo.ai ROI
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
