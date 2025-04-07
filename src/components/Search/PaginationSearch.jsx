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
    <div className="flex justify-center gap-2 my-24">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 border rounded-sm hover:text-primary disabled:text-white disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        &lt;
      </button>

      {/* Page Numbers */}
      {generatePageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 ${
            currentPage === page
              ? "bg-secondary text-white border border-primary"
              : "border text-secondary border-primary hover:bg-secondary hover:text-white"
          } rounded`}
          aria-label={`Page ${page}`}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 border rounded-sm hover:text-primary disabled:text-white disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        &gt;
      </button>
    </div>
  );
};

export default PaginationSearch;