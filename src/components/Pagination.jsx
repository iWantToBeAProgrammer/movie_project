"use client";

import { useState } from "react";

const Pagination = ({ totalPages, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageRangeStart, setPageRangeStart] = useState(1);

  const pagesToShow = 5;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      onPageChange(page);

      if (page > pageRangeStart + pagesToShow - 1) {
        setPageRangeStart(page - pagesToShow + 1);
      } else if (page < pageRangeStart) {
        setPageRangeStart(page);
      }
    }
  };

  const startPage = pageRangeStart;
  const endPage = Math.min(pageRangeStart + pagesToShow - 1, totalPages);
  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <div className="flex justify-center gap-2 my-24">
      {/* Previous */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 border rounded-sm hover:text-primary disabled:text-white disabled:cursor-not-allowed"
      >
        &lt;
      </button>

      {/* pages number */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`px-4 py-2 ${
            currentPage === page
              ? "bg-secondary text-white border border-primary"
              : "border text-secondary border-primary hover:bg-secondary hover:text-white"
          } rounded`}
        >
          {page}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 border rounded-sm hover:text-primary disabled:text-white disabled:cursor-not-allowed"
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
