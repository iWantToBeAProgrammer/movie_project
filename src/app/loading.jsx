import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex h-screen w-full flex-col items-center justify-center bg-black text-4xl font-bold text-white">
      <Image
        src={"/assets/images/logo/logo.svg"}
        width={300}
        height={300}
        alt="Loading Logo"
        priority
      />
      <span className="loading mt-4 loading-lg text-primary loading-dots"></span>
    </div>
  );
}
