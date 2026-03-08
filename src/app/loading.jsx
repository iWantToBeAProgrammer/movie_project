import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-neutral-900 to-black text-white">
      <div className="relative flex flex-col items-center justify-center">
        {/* Cinematic glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 animate-pulse rounded-full bg-primary/20 blur-[80px]"></div>
        
        {/* Logo */}
        <Image
          src={"/assets/images/logo/logo.svg"}
          width={280}
          height={280}
          alt="Loading Logo"
          className="relative z-10 drop-shadow-[0_0_15px_rgba(175,4,4,0.3)] transition-transform duration-700 ease-in-out hover:scale-105"
          priority
        />
        
        {/* Loading Indicator */}
        <div className="mt-8 flex flex-col items-center gap-4 relative z-10">
          <span className="loading loading-ring w-12 text-primary"></span>
          <p className="font-bebas_neue text-xl tracking-[0.25em] text-white/70 animate-pulse">
            Getting Your Tickets Ready...
          </p>
        </div>
      </div>
    </div>
  );
}
