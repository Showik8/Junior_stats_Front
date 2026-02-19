import Navbar from "@/app/components/public/Navbar";
import Footer from "@/app/components/public/Footer";
import TournamentSidebar from "@/app/components/public/TournamentSidebar";
import DashboardBackground from "@/app/components/public/DashboardBackground";
import SidebarWrapper from "@/app/components/public/SidebarWrapper";

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
      <DashboardBackground />
      <Navbar />
      <div className="flex-1 flex flex-col lg:flex-row relative z-10">
        <SidebarWrapper>
          <TournamentSidebar />
        </SidebarWrapper>
        <main className="flex-1 w-full overflow-y-auto">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
