import React from "react";

//export default function Pagination() {
const Pagination = ({ currentPage, itemsPerPage, length, onPageChanged }) => {
  const pagesCount = Math.ceil(length / itemsPerPage);
  const pages = [];
  for (let i = 1; i <= pagesCount; i++) {
    pages.push(i);
  }

  return (
    <div>
      <ul className="pagination pagination-sm">
        <li className={"page-item" + (currentPage <= 1 && " disabled")}>
          <button
            className="page-link"
            href="#"
            onClick={() => onPageChanged(currentPage - 1)}
          >
            &laquo;
          </button>
        </li>
        {pages.map((page) => (
          // https://fr.reactjs.org/docs/conditional-rendering.html
          //(currentPage === page ? " active" : "") s'ecit aussi (currentPage === page && " active")
          <li
            key={page}
            className={"page-item" + (currentPage === page && " active")}
          >
            <button
              className="page-link"
              href="#"
              onClick={() => onPageChanged(page)}
            >
              {page}
            </button>
          </li>
        ))}
        <li
          className={"page-item" + (currentPage >= pagesCount && " disabled")}
        >
          <button
            className="page-link"
            href="#"
            onClick={() => onPageChanged(currentPage + 1)}
          >
            &raquo;
          </button>
        </li>
      </ul>
    </div>
  );
};

Pagination.getData = (items, currentPage, itemsPerPage) => {
  // d'ou on part (start) pdt combien de temps (itemsperpage)
  const start = currentPage * itemsPerPage - itemsPerPage;
  return items.slice(start, start + itemsPerPage);
};

export default Pagination;
