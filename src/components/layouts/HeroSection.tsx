import React from "react";
import { LogoGroup } from "../common/LogoGroup";
import { TabButtons } from "../common/TabButtons";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  activeTab: "report" | "track" | null;
  onTabChange: (tab: "report" | "track") => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  activeTab,
  onTabChange,
}) => {
  return (
    <section className="relative bg-brand-primary overflow-hidden">

      {/* BACKGROUND LAYER */}
      <div className="absolute inset-0 z-0">

        {/* Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />

        {/* Decorative Blobs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute top-20 -left-20 w-72 h-72 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-24">

        <div className="text-center max-w-3xl mx-auto animate-fade-in-up">

          {/* TITLE */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {title}
          </h1>

          {/* SUBTITLE */}
          <p className="mt-4 text-white/80 text-lg md:text-xl font-medium">
            {subtitle}
          </p>

          {/* ACTION TABS */}
          <div className="mt-10">
            <TabButtons
              activeTab={activeTab}
              onTabChange={onTabChange}
              options={{
                report: { label: "Create New Ticket" },
                track: { label: "Track Ticket" },
              }}
            />
          </div>

          {/* SMALL INFO TEXT */}
          <p className="mt-6 text-white/60 text-sm">
            Secure • Fast • Official Support System
          </p>

        </div>
      </div>
    </section>
  );
};