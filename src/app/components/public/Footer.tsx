import Link from "next/link";
import { GiSoccerBall } from "react-icons/gi";
import { FiGithub, FiMail } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-white/5 bg-[#030812]">
      {/* Animated gradient line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--emerald-glow)]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1 lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <GiSoccerBall size={24} className="text-[var(--emerald-glow)]" />
              <span className="text-xl font-black tracking-tight text-white">
                Junior <span className="text-gradient-gold">Stats</span>
              </span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-sm">
              ახალგაზრდული ფეხბურთის სტატისტიკის პლატფორმა. ტურნირები, გუნდები, მოთამაშეები — ყველაფერი ერთ სივრცეში და დეტალური ანალიტიკით.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-widest mb-5">
              სწრაფი ბმულები
            </h4>
            <div className="flex flex-col gap-3">
              <Link href="/dashboard" className="text-sm text-[var(--text-secondary)] hover:text-[var(--emerald-glow)] transition-colors">
                მიმდინარე მატჩები
              </Link>
              <Link href="/players" className="text-sm text-[var(--text-secondary)] hover:text-[var(--emerald-glow)] transition-colors">
                მოთამაშეების ბაზა
              </Link>
              <Link href="/teams" className="text-sm text-[var(--text-secondary)] hover:text-[var(--emerald-glow)] transition-colors">
                გუნდების ბაზა
              </Link>
              <Link href="/dashboard" className="text-sm text-[var(--text-secondary)] hover:text-[var(--emerald-glow)] transition-colors">
                ჩემპიონატები
              </Link>
            </div>
          </div>

          {/* Contact & Socials */}
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-widest mb-5">
              კონტაქტი
            </h4>
            <div className="flex flex-col gap-4">
              <a href="mailto:info@juniorstats.ge" className="flex items-center gap-3 text-sm text-[var(--text-secondary)] hover:text-[var(--gold)] transition-colors group">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[var(--gold)]/10">
                  <FiMail size={14} />
                </div>
                <span>info@juniorstats.ge</span>
              </a>
              <a href="#" className="flex items-center gap-3 text-sm text-[var(--text-secondary)] hover:text-[var(--gold)] transition-colors group">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[var(--gold)]/10">
                  <FiGithub size={14} />
                </div>
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-[var(--text-secondary)]">
          <p>© {new Date().getFullYear()} Junior Stats. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Built with <span className="text-[var(--emerald-glow)] animate-pulse">♥</span> for Georgian youth football</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
