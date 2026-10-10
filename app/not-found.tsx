import Link from "next/link";
import Navbar from "@/components/Navbar";
import { ArrowLeft, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white selection:bg-[#a600ff] selection:text-black font-mono">
      <Navbar variant="landing" />

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-[#0d0d0d] border-2 border-[#a600ff] p-8 max-w-lg w-full text-center shadow-[8px_8px_0px_#7a07c5]">
          <div className="w-12 h-12 bg-[#1a0033] border border-[#a600ff] text-[#c466ff] flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-[#a600ff]" />
          </div>

          <div className="text-xs text-[#c466ff] uppercase tracking-wider mb-1">
            [ 404 // RESOURCE NOT FOUND ]
          </div>
          <h1 className="text-2xl font-black uppercase text-white mb-2">
            UNKNOWN ROUTE
          </h1>
          <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
            The requested pipeline, workflow, or trace does not exist or has been relocated in the cluster.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto px-4 py-2.5 bg-[#a600ff] hover:bg-[#c466ff] text-black font-bold text-xs uppercase flex items-center justify-center gap-2 border border-white"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> RETURN HOME
            </Link>
            <Link
              href="/workspace"
              className="w-full sm:w-auto px-4 py-2.5 bg-[#140026] hover:bg-[#1a0033] text-[#c466ff] border border-[#7a07c5] font-bold text-xs uppercase"
            >
              GO TO WORKSPACE
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-[#7a07c5] bg-[#070707] py-6 px-4 text-center text-xs text-zinc-400">
        OPLINK SYSTEM 404 HANDLER
      </footer>
    </div>
  );
}
