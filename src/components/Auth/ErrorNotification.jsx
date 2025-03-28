import { useRouter } from "next/navigation";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const ErrorNotification = () => {
  const router = useRouter();
  return (
    <>
      <div className="modal-box error-notification bg-base-100 border-2 border-primary/60 px-12 py-12 flex flex-col items-center justify-center gap-2">
        <HiOutlineExclamationCircle size={104} />

        <h3 className="error-title uppercase font-bebas_neue text-primary text-4xl">
          You Need to login
        </h3>

        <p className="error-desc font-raleway font-semibold text-lg text-white text-center">
          Please log in to continue. You need an account to use this feature.
        </p>
        <div className="modal-action font-bebas_neue">
          <form method="dialog" className="flex gap-3">
            {/* if there is a button in form, it will close the modal */}
            <button className="cancel-button btn btn-md w-44 text-3xl tracking-wide bg-white text-black font-normal flex hover:bg-white/70">
              CANCEL
            </button>

            <button
              onClick={() => router.push("/auth/login")}
              className="login-button btn btn-md w-44 text-3xl tracking-wide bg-base-100 border-2 font-normal text-white flex btn-primary"
            >
              LOGIN
            </button>
          </form>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop bg-black/60"></form>
    </>
  );
};

export default ErrorNotification;
