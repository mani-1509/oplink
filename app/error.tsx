"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertOctagon, RefreshCw, ArrowLeft } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global runtime error caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white selection:bg-[#a600ff] selection:text-black font-mono">
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-[#0d0d0d] border-2 border-red-500 p-8 max-w-lg w-full text-center shadow-[8px_8px_0px_rgba(239,68,68,0.5)]">
          <div className="w-12 h-12 bg-red-950 border border-red-500 text-red-400 flex items-center justify-center mx-auto mb-4">
            <AlertOctagon className="w-6 h-6 text-red-400" />
          </div>

          <div className="text-xs text-red-400 uppercase tracking-wider mb-1">
            [ 500 // RUNTIME EXCEPTION ]
          </div>
          <h1 className="text-2xl font-black uppercase text-white mb-2">
            EXECUTION INTERRUPTED
          </h1>
          <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
            An unexpected error occurred during execution. State has been safely contained.
          </p>

          <div className="p-3 bg-red-950/30 border border-red-500/50 text-[11px] text-red-300 font-mono mb-6 text-left break-all">
            {error.message || "Unknown execution error"}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => reset()}
              className="w-full sm:w-auto px-4 py-2.5 bg-[#a600ff] hover:bg-[#c466ff] text-black font-bold text-xs uppercase flex items-center justify-center gap-2 border border-white cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> RE-TRY ACTION
            </button>
            <Link
              href="/"
              className="w-full sm:w-auto px-4 py-2.5 bg-[#140026] hover:bg-[#1a0033] text-[#c466ff] border border-[#7a07c5] font-bold text-xs uppercase flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> RETURN HOME
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-[#7a07c5] bg-[#070707] py-6 px-4 text-center text-xs text-zinc-400">
        OPLINK SYSTEM 500 ERROR BOUNDARY
      </footer>
    </div>
  );
}
