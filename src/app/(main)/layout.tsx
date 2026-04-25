import Sidebar from '@/components/app/Sidebar';
import MobileNav from '@/components/app/MobileNav';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen items-stretch gap-2 bg-[linear-gradient(90deg,_#C9D6FF_0%,_#E9E4F0_100%)] p-2">
      <Sidebar />
      <main className="relative flex flex-1 flex-col gap-4 overflow-hidden rounded-lg bg-white/80 p-4 pb-20 shadow-md lg:pb-4">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
