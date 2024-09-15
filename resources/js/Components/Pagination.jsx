import React from "react";
import { router } from "@inertiajs/react";

const Pagination = ({ links }) => {
  const handlePageChange = (url) => {
    if (url) {
      router.get(url);
    }
  };

  return (
    <div className="flex justify-center mt-4">
      {links &&
        links.map((link, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(link.url)}
            className={`px-3 py-1 mx-1 rounded ${
              link.active
                ? "bg-green-900 text-white"
                : "bg-white text-green-bg-green-900"
            } ${!link.url ? "cursor-not-allowed" : ""}`}
            disabled={!link.url}
          >
            {link.label.replace("&laquo;", "«").replace("&raquo;", "»")}
          </button>
        ))}
    </div>
  );
};

export default Pagination;
