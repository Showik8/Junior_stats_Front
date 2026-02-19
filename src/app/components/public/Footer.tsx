import Link from "next/link";
import { GiSoccerBall } from "react-icons/gi";
import { FiGithub, FiMail } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-white/5 bg-[#030812]">
      {/* Animated gradient line */}
      <div className="absolute top-0 left-0 w-full h-px">
        <div className="h-full bg-linear-to-r from-transparent via-emerald-500/60 to-transparent animate-gradient bg-size-[200%_100%]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <GiSoccerBall size={24} className="text-emerald-500" />
              <span className="text-lg font-extrabold tracking-tight text-white">
                Junior <span className="text-gradient-gold">Stats</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              ახალგაზრდული ფეხბურთის სტატისტიკის პლატფორმა. ტურნირები, გუნდები,
              მოთამაშეები — ყველაფერი ერთ სივრცეში.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-[0.15em] mb-5">
              ნავიგაცია
            </h4>
            <div className="flex flex-col gap-3">
              <Link
                href="/"
                className="text-sm text-slate-400 hover:text-emerald-400 transition-colors duration-300"
              >
                ტურნირები
              </Link>
              <Link
                href="/admin"
                className="text-sm text-slate-400 hover:text-emerald-400 transition-colors duration-300"
              >
                ადმინ პანელი
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-[0.15em] mb-5">
              კონტაქტი
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:info@juniorstats.ge"
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors duration-300"
              >
                <FiMail size={14} />
                info@juniorstats.ge
              </a>
              <a
                href="#"
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors duration-300"
              >
                <FiGithub size={14} />
                GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-700">
            © {new Date().getFullYear()} Junior Stats. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-700">
            <span>Built with</span>
            <span className="text-emerald-600">♥</span>
            <span>for Georgian youth football</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
