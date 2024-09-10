import Link from "next/link";

const Navbar = () => {
  return (
    <>
      <div className="navbar h-24 [text-shadow:_4px_5px_10px_rgba(0,0,0,0.67)] text-5xl absolute top-0 px-40 text-neutral z-20">
        <div className="navbar-wrapper flex items-center justify-between w-full ">
          <div className="bg-accent px-3 py-1 rounded-xl">
            <h1 className="font-bebas_neue text-neutral">
              Cinema
              <span className="font-raleway_italic font-black bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                Tix
              </span>
            </h1>
          </div>
          <div className="navbar-item font-bebas_neue flex gap-8 items-center text-4xl">
            <Link href="/movie-list">
              <h1>MOVIE LIST</h1>
            </Link>
            <Link href="/watchlist">
              <h1>WATCHLIST</h1>
            </Link>
            <Link href="/login">
              <button className="bg-neutral bg-opacity-30 px-4 py-3 box-border rounded-xl">
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
