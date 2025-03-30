import { useRouter } from "next/navigation";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const ErrorNotification = () => {
  const router = useRouter();
  return (
    <>
      <div className="error-notification modal-box flex flex-col items-center justify-center gap-2 border-2 border-primary/60 bg-base-100 px-12 py-12">
        <HiOutlineExclamationCircle size={104} />

        <h3 className="error-title font-bebas_neue text-4xl text-primary uppercase">
          You Need to login
        </h3>

        <p className="error-desc text-center font-raleway text-lg font-semibold text-white">
          Please log in to continue. You need an account to use this feature.
        </p>
        <div className="modal-action font-bebas_neue">
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
        </div>
      </div>

      <form method="dialog" className="modal-backdrop bg-black/60"></form>
    </>
  );
};

export default ErrorNotification;
