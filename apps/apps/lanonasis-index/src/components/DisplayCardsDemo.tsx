"use client";

import DisplayCards from "../components/ui/display-cards";
import { Sparkles } from "lucide-react";

const defaultCards = [
  {
    icon: <Sparkles className="size-4 text-blue-300" />,
    title: "VortexCore AI",
    description: "Intelligent compliance automation and business insights",
    date: "Live",
    iconClassName: "text-blue-500",
    titleClassName: "text-blue-500",
    className:
      "[grid-area:stack] hover:-translate-y-4 bg-slate-800/80 border border-slate-700 rounded-xl p-6 transition-all duration-300 hover:bg-slate-700/80 hover:border-slate-600",
  },
  {
    icon: <Sparkles className="size-4 text-green-300" />,
    title: "VortexPay",
    description: "Instant B2B payments with multi-currency support",
    date: "Active",
    iconClassName: "text-green-500",
    titleClassName: "text-green-500",
    className:
      "[grid-area:stack] translate-x-6 translate-y-4 hover:-translate-y-2 bg-slate-800/80 border border-slate-700 rounded-xl p-6 transition-all duration-300 hover:bg-slate-700/80 hover:border-slate-600",
  },
  {
    icon: <Sparkles className="size-4 text-purple-300" />,
    title: "BizGenie",
    description: "AI-powered SME insights and cash flow forecasting",
    date: "Beta",
    iconClassName: "text-purple-500",
    titleClassName: "text-purple-500",
    className:
      "[grid-area:stack] translate-x-12 translate-y-8 hover:translate-y-4 bg-slate-800/80 border border-slate-700 rounded-xl p-6 transition-all duration-300 hover:bg-slate-700/80 hover:border-slate-600",
  },
];

function DisplayCardsDemo() {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 to-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Our Platform in Action
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the power of our integrated fintech ecosystem
          </p>
        </div>
        
        <div className="flex min-h-[500px] w-full items-center justify-center">
          <div className="w-full max-w-4xl">
            <DisplayCards cards={defaultCards} />
          </div>
        </div>
      </div>
    </section>
  );
}

export { DisplayCardsDemo };
