import Link from "next/link";

const Navbar = () => {
  return (
    <>
      <div className="navbar h-0 lg:h-20 [text-shadow:_4px_5px_10px_rgba(0,0,0,0.67)] text-sm lg:text-4xl absolute -top-1 lg:top-0 text-neutral z-20">
        <div className="flex justify-between w-11/12 mx-auto lg:w-9/12 navbar-wrapper">
          <div className="px-3 py-1 bg-accent rounded-xl">
            <h1 className="font-bebas_neue text-neutral">
              Cinema
              <span className="font-black text-transparent font-raleway_italic bg-gradient-to-r from-primary to-secondary bg-clip-text">
                Tix
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-2 text-sm lg:gap-8 lg:text-2xl navbar-item font-bebas_neue">
            <Link href="/movie-list">
              <h1>MOVIE LIST</h1>
            </Link>
            <Link href="/watchlist">
              <h1>WATCHLIST</h1>
            </Link>
            <Link href="/login">
              <button className="box-border px-4 py-3 bg-neutral bg-opacity-30 rounded-xl">
                sign in
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
