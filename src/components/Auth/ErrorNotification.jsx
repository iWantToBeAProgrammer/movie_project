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
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <div className="error-notification modal-box flex flex-col items-center justify-center gap-2 border-2 border-primary/60 bg-base-100 px-8 py-12">
        {icon}

        <h3 className="error-title font-bebas_neue text-4xl text-primary uppercase">
          {title}
        </h3>

        <p className="error-desc text-center font-raleway font-semibold text-white">
          {desc}
        </p>
        <div className="modal-action w-full justify-center font-bebas_neue">
          {!verificationEmail ? (
            <form method="dialog" className="flex gap-3">
              {/* if there is a button in form, it will close the modal */}
              <button className="cancel-button btn flex w-44 bg-white text-3xl font-normal tracking-wide text-black btn-md hover:bg-white/70">
                CANCEL
              </button>

              <button
                onClick={() => router.push("/auth/login")}
                className="login-button btn flex w-44 border-2 bg-base-100 text-3xl font-normal tracking-wide text-white btn-md btn-primary"
              >
                LOGIN
              </button>
            </form>
          ) : (
            <div className="font-raleway">
              <div className="divider"></div>
              <p>
                {counter > 0 ? (
                  <span className="countdown">
                    please wait for:
                    <span
                      className="ms-2"
                      style={
                        { "--value": counter } /* as React.CSSProperties */
                      }
                      aria-live="polite"
                      aria-label={counter}
                    >
                      {" "}
                      {counter}
                    </span>
                  </span>
                ) : (
                  <p>
                    If you not got any mail{" "}
                    <span
                      className="cursor-pointer font-semibold underline"
                      onClick={handleResendEmail}
                      tabIndex={0}
                      role="button"
                    >
                      Resend verification mail
                    </span>
                  </p>
                )}
              </p>
            </div>
          )}
        </div>
      </div>

      <form method="dialog" className="modal-backdrop bg-black/60"></form>
    </>
  );
};

export default ErrorNotification;
