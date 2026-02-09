import { authRequest } from "@/utility/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ErrorNotification = ({ icon, title, desc, verificationEmail = null }) => {
  const router = useRouter();

  const [counter, setCounter] = useState(59);
  const [resendMessage, setResendMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (counter <= 0) return;

    const timer = setTimeout(() => {
      setCounter((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [counter]);

  const handleResendEmail = async () => {
    setResendMessage("");
    try {
      const response = await authRequest("resendEmail", {
        email: verificationEmail,
      });
      setCounter(59);
      // Optional: Tambahkan toast success disini jika ada library toast
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <div className="error-notification relative modal-box flex w-11/12 max-w-sm flex-col items-center justify-center gap-4 border border-primary/40 bg-[#1A1919] p-6 text-center shadow-2xl md:max-w-lg md:gap-6 md:px-8 md:py-10">
        {/* Icon Wrapper untuk ukuran responsif */}
        <div className="text-primary [&>svg]:h-16 [&>svg]:w-16 md:[&>svg]:h-24 md:[&>svg]:w-24">
          {icon}
        </div>

        <h3 className="error-title font-bebas_neue text-3xl tracking-wide text-white uppercase md:text-5xl">
          {title}
        </h3>

        <p className="error-desc px-2 font-raleway text-sm leading-relaxed font-medium text-gray-300 md:text-base">
          {desc}
        </p>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="modal-action mt-2 w-full justify-center font-bebas_neue">
          {!verificationEmail ? (
            <form
              method="dialog"
              className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center"
            >
              {/* if there is a button in form, it will close the modal */}
              <button className="btn w-full bg-white text-xl font-normal tracking-wide text-black hover:bg-gray-200 sm:w-40 md:text-2xl">
                CANCEL
              </button>

              <button
                type="button" 
                onClick={() => router.push("/auth/login")}
                className="btn w-full text-xl font-normal tracking-wide text-white btn-primary sm:w-40 md:text-2xl"
              >
                LOGIN
              </button>
            </form>
          ) : (
            <div className="w-full font-raleway">
              <div className="divider my-2 divider-neutral"></div>
              <div className="mt-2 text-sm text-gray-400 md:text-base">
                {counter > 0 ? (
                  <p className="flex items-center justify-center gap-2">
                    Resend email in:
                    <span className="font-mono font-bold text-primary">
                      00:{counter < 10 ? `0${counter}` : counter}
                    </span>
                  </p>
                ) : (
                  <p>
                    Didn&apos;t receive the email?{" "}
                    <button
                      onClick={handleResendEmail}
                      className="font-bold text-primary underline transition-colors hover:text-primary/80"
                    >
                      Resend Now
                    </button>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <form
        method="dialog"
        className="modal-backdrop bg-black/80 backdrop-blur-sm"
      >
        <button>close</button>
      </form>
    </>
  );
};

export default ErrorNotification;
