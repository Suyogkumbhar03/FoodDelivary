import React from 'react';
import { useCraveStore } from '../store/useCraveStore';

export default function Footer() {
  const { setActiveView } = useCraveStore();

  return (
    <footer className="w-full bg-[#1A1715] text-[#FAF7F2] border-t border-[#332B25] pt-16 pb-12 select-none">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 space-y-12">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand & Manifesto Column (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              {/* Logo Badge */}
              <div className="w-10 h-10 rounded-2xl bg-[#E05326] flex items-center justify-center text-white font-serif font-bold text-xl shadow-md">
                P
              </div>
              <span className="font-serif text-2xl font-extrabold tracking-tight text-white">
                PetPooja
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#E05326]/20 text-[#E05326] font-mono text-[10px] font-bold uppercase tracking-wider">
                PEHLE PET POOJA
              </span>
            </div>

            <p className="font-body text-xs md:text-sm text-[#A0978C] leading-relaxed max-w-sm">
              "Pehle pet pooja, phir kaam dooja" — Your favorite Indian meals delivered hot & fresh with authentic flavor, royal hygiene, and lightning speed to your doorstep.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="#instagram"
                className="w-9 h-9 rounded-full bg-[#2A2420] border border-[#332B25] flex items-center justify-center text-[#A0978C] hover:text-[#E05326] hover:border-[#E05326] transition-colors"
                aria-label="Instagram"
              >
                <span className="material-symbols-outlined text-[18px]">photo_camera</span>
              </a>
              <a
                href="#twitter"
                className="w-9 h-9 rounded-full bg-[#2A2420] border border-[#332B25] flex items-center justify-center text-[#A0978C] hover:text-[#E05326] hover:border-[#E05326] transition-colors"
                aria-label="Twitter"
              >
                <span className="material-symbols-outlined text-[18px]">tag</span>
              </a>
              <a
                href="#youtube"
                className="w-9 h-9 rounded-full bg-[#2A2420] border border-[#332B25] flex items-center justify-center text-[#A0978C] hover:text-[#E05326] hover:border-[#E05326] transition-colors"
                aria-label="YouTube"
              >
                <span className="material-symbols-outlined text-[18px]">play_circle</span>
              </a>
            </div>
          </div>

          {/* Column 2: Culinary Traditions (3 cols) */}
          <div className="lg:col-span-3 space-y-3 font-body text-xs md:text-sm">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider text-[#E05326]">
              Culinary Traditions
            </h4>
            <ul className="space-y-2 text-[#A0978C]">
              <li>
                <button onClick={() => setActiveView('gourmet')} className="hover:text-white transition-colors text-left">
                  Awadhi Dum Pukht & Biryani
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('gourmet')} className="hover:text-white transition-colors text-left">
                  Hyderabadi Shahi Handi Curries
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('explore')} className="hover:text-white transition-colors text-left">
                  Wood-Fired Tandoori Delicacies
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('explore')} className="hover:text-white transition-colors text-left">
                  Heirloom Indian Desserts & Sweets
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('explore')} className="hover:text-white transition-colors text-left">
                  Malabar Coastal Spices & Seafood
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Guest Experience (2 cols) */}
          <div className="lg:col-span-2 space-y-3 font-body text-xs md:text-sm">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider text-[#E05326]">
              Customer Privileges
            </h4>
            <ul className="space-y-2 text-[#A0978C]">
              <li className="hover:text-white transition-colors cursor-pointer">
                Gourmet Catering
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                Support Concierge
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                Purity & Hygiene Audits
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                Partner Outlets Network
              </li>
              <li className="hover:text-white transition-colors cursor-pointer">
                PetPooja Gold Pass
              </li>
            </ul>
          </div>

          {/* Column 4: Concierge & Contact (3 cols) */}
          <div className="lg:col-span-3 space-y-3 font-body text-xs md:text-sm">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider text-[#E05326]">
              Customer Support & Care
            </h4>
            <p className="text-[#A0978C] leading-relaxed">
              Daily food delivery from 11:00 AM to 11:30 PM across major metro cities in India.
            </p>

            <div className="p-3 rounded-2xl bg-[#2A2420] border border-[#332B25] space-y-1">
              <div className="font-mono text-[10px] text-[#A0978C] uppercase font-bold">24/7 Helpline</div>
              <div className="font-mono text-xs font-bold text-white flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#E05326] text-[16px]">call</span>
                <span>+91 (800) 420-POOJA</span>
              </div>
              <div className="font-mono text-[11px] text-[#A0978C] pt-0.5">
                support@petpooja.in
              </div>
            </div>
          </div>

        </div>

        {/* Separator Divider */}
        <div className="h-px w-full bg-[#332B25]" />

        {/* Bottom Sub-Footer Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 font-body text-xs text-[#A0978C]">
          <div className="flex items-center gap-2 text-center md:text-left">
            <span>© {new Date().getFullYear()} PetPooja Technologies Pvt. Ltd.</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Pehle pet pooja, phir kaam dooja.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-medium">
            <a href="#ethics" className="hover:text-white transition-colors">Culinary Ethics</a>
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-white transition-colors">Terms of Hospitality</a>
            <a href="#fssai" className="hover:text-white transition-colors">FSSAI Compliance</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
