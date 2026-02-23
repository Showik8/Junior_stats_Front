import Link from "next/link";
import { FaFingerprint, FaChartLine, FaShieldAlt } from "react-icons/fa";

export default function ScoutInfoSection() {
  return (
    <section className="py-24 relative bg-black/40 border-y border-white/5">
      <div className="container max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Text Content */}
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-(--gold)/10 text-(--gold) mb-6 text-sm font-bold tracking-widest border border-(--gold)/20">
              <FaFingerprint />
              პროფესიონალთათვის
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              დეტალური სტატისტიკა <br />
              <span className="text-(--emerald-glow)">სკაუტებისა და აგენტებისთვის</span>
            </h2>
            
            <p className="text-lg text-(--text-secondary) mb-10 font-light leading-relaxed">
              გახსენით წვდომა მოთამაშეთა სიღრმისეულ ანალიტიკაზე. თვალი ადევნეთ მათ პროგრესს, შეადარეთ მონაცემები სხვადასხვა სეზონში და აღმოაჩინეთ მომავალი ვარსკვლავები.
            </p>

            <ul className="space-y-6 mb-12">
              <li className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/40 shrink-0 border border-white/10">
                  <FaChartLine className="text-xl" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">სიღრმისეული ანალიტიკა</h4>
                  <p className="text-sm text-(--text-secondary)">სრული ინფორმაცია ყოველ მატჩზე და მოთამაშის ტექნიკურ მაჩვენებლებზე.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/40 shrink-0 border border-white/10">
                  <FaShieldAlt className="text-xl" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">დახურული მონაცემთა ბაზა</h4>
                                    <p className="text-sm text-(--text-secondary)">მხოლოდ ავტორიზებული პირებისთვის განკუთვნილი სპორტული რეპორტები.</p>
                </div>
              </li>
            </ul>

            <Link 
              href="/sign-in" 
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-(--bg-card-solid) border border-(--emerald-glow)/40 hover:bg-(--emerald-glow)/10 text-white rounded-xl font-bold transition-all duration-300 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.5)] w-full sm:w-auto"
            >
              სკაუტის ავტორიზაცია
              <FaFingerprint className="text-lg text-white/50" />
            </Link>
          </div>

          {/* Right Visualizer Placeholder */}
          <div className="order-1 lg:order-2 relative h-[500px] w-full flex items-center justify-center">
             {/* Back Glow */}
            <div className="absolute inset-0 bg-linear-to-r from-(--emerald-glow)/20 to-(--gold)/20 blur-[80px] rounded-full" />
            
            {/* Abstract UI Representation */}
            <div className="relative glass-card w-full max-w-md h-[400px] rounded-3xl border border-white/10 p-6 flex flex-col gap-4 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
               {/* Header Fake */}
               <div className="flex items-center gap-4 mb-4">
                 <div className="w-16 h-16 rounded-full bg-white/10 animate-pulse border border-white/20" />
                 <div className="flex-1 space-y-2">
                   <div className="h-4 w-1/2 bg-white/10 rounded animate-pulse" />
                   <div className="h-3 w-1/4 bg-(--gold)/30 rounded animate-pulse" />
                 </div>
               </div>
               
               {/* Stats Grid Fake */}
               <div className="grid grid-cols-2 gap-4">
                 <div className="h-24 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center justify-center gap-2">
                   <div className="text-2xl font-black text-white">92%</div>
                   <div className="text-xs text-(--text-secondary)">პასების სიზუსტე</div>
                 </div>
                 <div className="h-24 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center justify-center gap-2">
                   <div className="text-2xl font-black text-white">14.5</div>
                   <div className="text-xs text-(--text-secondary)">გარბენი (კმ)</div>
                 </div>
               </div>

               {/* Chart Fake */}
               <div className="flex-1 rounded-2xl bg-white/5 border border-white/5 overflow-hidden flex items-end p-4 gap-2">
                 {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                    <div key={i} className="flex-1 bg-linear-to-t from-(--emerald-glow)/40 to-transparent rounded-t-sm" style={{ height: `${h}%` }} />
                 ))}
               </div>
            </div>
            
            {/* Floating Element */}
            <div className="absolute -bottom-6 -left-6 glass-card px-6 py-4 rounded-2xl border border-white/10 flex items-center gap-3 animate-float shadow-xl delay-200 z-20">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-(--gold) opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-(--gold)"></span>
              </span>
              <span className="text-sm font-bold">მონაცემები განახლებულია</span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
