import Link from "next/link";
import { FaFacebookF, FaTelegramPlane, FaInstagram, FaYoutube } from "react-icons/fa";
import { GiSoccerBall } from "react-icons/gi";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/8 bg-[#060c1a]">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-[#10b981]/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Main row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Left: Nav links */}
          <div className="flex flex-wrap items-center gap-6">
            <Link
              href="#"
              className="text-sm text-white/40 hover:text-white transition-colors"
            >
              ჩვენს შესახებ
            </Link>
            <Link
              href="#"
              className="text-sm text-white/40 hover:text-white transition-colors"
            >
              კონტაქტი
            </Link>
            <Link
              href="#"
              className="text-sm text-white/40 hover:text-white transition-colors"
            >
              კონფიდენციალურობა
            </Link>
            <Link
              href="#"
              className="text-sm text-white/40 hover:text-white transition-colors"
            >
              მოხმარების წესები
            </Link>
          </div>

          {/* Right: Social icons */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              aria-label="Facebook"
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/8 flex items-center justify-center text-white/50 hover:text-white transition-all"
            >
              <FaFacebookF size={13} />
            </a>
            <a
              href="#"
              aria-label="Telegram"
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/8 flex items-center justify-center text-white/50 hover:text-white transition-all"
            >
              <FaTelegramPlane size={13} />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/8 flex items-center justify-center text-white/50 hover:text-white transition-all"
            >
              <FaInstagram size={13} />
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/8 flex items-center justify-center text-white/50 hover:text-white transition-all"
            >
              <FaYoutube size={13} />
            </a>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-2">
          <GiSoccerBall className="text-[#10b981] text-sm opacity-60" />
          <p className="text-xs text-white/25 text-center">
            საავტორო უფლებები დაცულია © 2022-{currentYear} · Junior Stats
          </p>
        </div>
      </div>
    </footer>
  );
}
