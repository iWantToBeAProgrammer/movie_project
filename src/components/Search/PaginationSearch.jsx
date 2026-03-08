"use client";

const PaginationSearch = ({ currentPage, totalPages, onPageChange }) => {
  const generatePageNumbers = () => {
    const visiblePages = 5; // Jumlah halaman yang ditampilkan
    const pages = [];

    // Kasus ketika total halaman <= visiblePages
    if (totalPages <= visiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Kasus ketika currentPage di awal
    if (currentPage <= Math.ceil(visiblePages / 2)) {
      for (let i = 1; i <= visiblePages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Kasus ketika currentPage di akhir
    if (currentPage >= totalPages - Math.floor(visiblePages / 2)) {
      for (let i = totalPages - visiblePages + 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Kasus ketika currentPage di tengah
    const start = currentPage - Math.floor(visiblePages / 2);
    const end = currentPage + Math.floor(visiblePages / 2);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-wrap justify-center items-center gap-3 my-12 px-4">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition-all hover:bg-primary hover:border-primary disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:border-white/10 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {generatePageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`h-10 min-w-[40px] px-3 rounded-lg font-bold transition-all ${
              currentPage === page
                ? "bg-gradient-to-r from-primary to-secondary text-white shadow-[0_0_15px_rgba(var(--color-primary),0.3)]"
                : "border border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-primary hover:bg-primary/10"
            }`}
            aria-label={`Page ${page}`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition-all hover:bg-primary hover:border-primary disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:border-white/10 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default PaginationSearch;