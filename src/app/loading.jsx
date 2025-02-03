import Image from "next/image";

export default function Loading() {
  return (
    <>
      <div className="w-full h-screen bg-black text-4xl font-bold text-white flex items-center flex-col justify-center">
        <Image src={"/assets/images/logo/logo.svg"} width={300} height={300}/>
        <span className="loading loading-dots loading-lg"></span>
      </div>
    </>
  );
}
