import Image from "next/image";

export default function Loading() {
  return (
    <>
      <div className="fixed inset-0 flex h-screen w-full flex-col items-center justify-center bg-black text-4xl font-bold text-white">
        <Image src={"/assets/images/logo/logo.svg"} width={300} height={300} />
        <span className="loading loading-lg loading-dots"></span>
      </div>
    </>
  );
}
