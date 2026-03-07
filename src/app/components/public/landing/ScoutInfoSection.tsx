"use client";

import { useRef } from "react";
import Link from "next/link";
import { FaFingerprint, FaChartLine, FaShieldAlt } from "react-icons/fa";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function ScoutInfoSection() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse"
      }
    });

    tl.fromTo(
      ".scout-text-content > *",
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" }
    ).fromTo(
      ".scout-visualizer",
      { x: 50, opacity: 0, scale: 0.9 },
      { x: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.2)" },
      "-=0.6"
    ).fromTo(
      ".scout-floating-badge",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.5)" },
      "-=0.4"
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-24 relative bg-black/40 border-y border-white/5 overflow-hidden">
      <div className="container max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Text Content */}
          <div className="scout-text-content order-2 lg:order-1 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-(--gold)/10 text-(--gold) mb-6 text-sm font-bold tracking-widest border border-(--gold)/20 shadow-[0_0_15px_rgba(250,204,21,0.15)]">
              <FaFingerprint />
              პროფესიონალთათვის
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              დეტალური სტატისტიკა <br />
              <span className="text-(--emerald-glow) drop-shadow-md">სკაუტებისა და აგენტებისთვის</span>
            </h2>
            
            <p className="text-lg text-(--text-secondary) mb-10 font-medium leading-relaxed max-w-xl">
              გახსენით წვდომა მოთამაშეთა სიღრმისეულ ანალიტიკაზე. თვალი ადევნეთ მათ პროგრესს, შეადარეთ მონაცემები სხვადასხვა სეზონში და აღმოაჩინეთ მომავალი ვარსკვლავები.
            </p>

            <ul className="space-y-6 mb-12 w-full max-w-xl">
              <li className="flex items-start gap-5 glass-card p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 group">
                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-white/10 to-white/5 flex items-center justify-center text-(--emerald-glow) shrink-0 border border-white/10 group-hover:scale-110 group-hover:border-(--emerald-glow)/30 transition-all duration-300 shadow-lg">
                  <FaChartLine className="text-2xl" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg mb-1 group-hover:text-gradient-primary transition-colors">სიღრმისეული ანალიტიკა</h4>
                  <p className="text-sm text-(--text-secondary) leading-relaxed">სრული ინფორმაცია ყოველ მატჩზე და მოთამაშის ტექნიკურ მაჩვენებლებზე.</p>
                </div>
              </li>
              <li className="flex items-start gap-5 glass-card p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 group">
                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-white/10 to-white/5 flex items-center justify-center text-(--gold) shrink-0 border border-white/10 group-hover:scale-110 group-hover:border-(--gold)/30 transition-all duration-300 shadow-lg">
                  <FaShieldAlt className="text-2xl" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg mb-1 group-hover:text-gradient-gold transition-colors">დახურული მონაცემთა ბაზა</h4>
                  <p className="text-sm text-(--text-secondary) leading-relaxed">მხოლოდ ავტორიზებული პირებისთვის განკუთვნილი სპორტული რეპორტები.</p>
                </div>
              </li>
            </ul>

            <Link 
              href="/sign-in" 
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-(--bg-card-solid) border border-(--emerald-glow)/40 hover:bg-(--emerald-glow)/10 text-white rounded-xl font-bold transition-all duration-300 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.5)] w-full sm:w-auto hover:-translate-y-1"
            >
              სკაუტის ავტორიზაცია
              <FaFingerprint className="text-xl text-(--emerald-glow)" />
            </Link>
          </div>

          {/* Right Visualizer Placeholder */}
          <div className="order-1 lg:order-2 relative h-[500px] w-full flex items-center justify-center">
             {/* Back Glow */}
            <div className="absolute inset-0 bg-linear-to-r from-(--emerald-glow)/20 to-(--gold)/20 blur-[100px] rounded-full mix-blend-screen" />
            
            {/* Abstract UI Representation */}
            <div className="scout-visualizer relative glass-card w-full max-w-md h-[400px] rounded-4xl border border-white/10 p-7 flex flex-col gap-5 shadow-2xl transform rotate-3 hover:rotate-1 transition-transform duration-500 bg-[#060c1a]/80 backdrop-blur-2xl">
               {/* Header Fake */}
               <div className="flex items-center gap-4 mb-2">
                 <div className="w-16 h-16 rounded-full bg-linear-to-tr from-white/10 to-white/5 animate-pulse border border-white/20 shadow-inner" />
                 <div className="flex-1 space-y-3">
                   <div className="h-4 w-1/2 bg-white/20 rounded-md animate-pulse" />
                   <div className="h-3 w-1/3 bg-(--gold)/40 rounded-md animate-pulse" />
                 </div>
               </div>
               
               {/* Stats Grid Fake */}
               <div className="grid grid-cols-2 gap-4">
                 <div className="h-28 rounded-2xl bg-linear-to-br from-white/10 to-white/5 border border-white/10 flex flex-col items-center justify-center gap-2 shadow-inner">
                   <div className="text-3xl font-black text-white drop-shadow-md">92%</div>
                   <div className="text-xs font-bold text-(--text-secondary) uppercase tracking-wider">პასების სიზუსტე</div>
                 </div>
                 <div className="h-28 rounded-2xl bg-linear-to-br from-white/10 to-white/5 border border-white/10 flex flex-col items-center justify-center gap-2 shadow-inner">
                   <div className="text-3xl font-black text-(--emerald-glow) drop-shadow-md">14.5</div>
                   <div className="text-xs font-bold text-(--text-secondary) uppercase tracking-wider">გარბენი (კმ)</div>
                 </div>
               </div>

               {/* Chart Fake */}
               <div className="flex-1 rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex items-end p-4 gap-2 pt-8">
                 {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                    <div key={i} className="flex-1 w-full bg-linear-to-t from-(--emerald-glow)/50 to-(--emerald-glow)/10 rounded-t-md hover:from-(--gold)/50 hover:to-(--gold)/10 transition-colors duration-300" style={{ height: `${h}%` }} />
                 ))}
               </div>
            </div>
            
            {/* Floating Element */}
            <div className="scout-floating-badge absolute -bottom-4 -left-8 lg:-left-12 glass-card px-6 py-4 rounded-2xl border border-white/10 flex items-center gap-4 animate-float shadow-2xl delay-200 z-20 bg-[#060c1a]/90 backdrop-blur-xl">
              <span className="flex h-3.5 w-3.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-(--gold) opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-(--gold) shadow-[0_0_10px_rgba(250,204,21,0.8)]"></span>
              </span>
              <span className="text-sm font-bold tracking-wide">მონაცემები განახლებულია</span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
