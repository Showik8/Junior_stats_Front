import TournamentSidebar from "@/app/components/public/TournamentSidebar";

export default function TournamentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
      <TournamentSidebar />
      <div className="flex-1 w-full lg:w-[calc(100%-18rem)]">
        {children}
      </div>
    </div>
  );
}
