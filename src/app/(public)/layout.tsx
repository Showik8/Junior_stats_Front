import Navbar from "@/app/components/public/Navbar";
import Footer from "@/app/components/public/Footer";

export const metadata = {
  title: "Junior Stats — ახალგაზრდული ფეხბურთის სტატისტიკა",
  description: "ტურნირები, გუნდები, მოთამაშეები — ახალგაზრდული ფეხბურთის სრული სტატისტიკა",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen text-slate-200">
      <Navbar />
      <main className="flex-1 w-full relative z-10">{children}</main>
      <Footer />
    </div>
  );
}
