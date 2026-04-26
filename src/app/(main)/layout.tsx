import Sidebar from '@/components/app/Sidebar';
import MobileNav from '@/components/app/MobileNav';

/**
 * Shell de la app — sigue el patrón "soft glass on gradient" del DS:
 * gradiente horizontal de fondo + sidebar y main translúcidos.
 *
 * Importante: el <main> es **el** contenedor blanco translúcido del DS.
 * Las páginas hijas NO deben envolverse en otro contenedor blanco —
 * viven directamente sobre este lienzo.
 */
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen items-stretch gap-2 bg-[linear-gradient(90deg,_#C9D6FF_0%,_#E9E4F0_100%)] p-2">
      <Sidebar />
      <main className="flex flex-1 flex-col overflow-hidden rounded-lg bg-white/80 shadow-md">
        <div className="flex-1 overflow-y-auto pb-20 lg:pb-0">{children}</div>
      </main>
      <MobileNav />
    </div>
  );
}
