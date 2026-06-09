import React from "react";

interface Props {
  page: number;
  totalPages: number;
  setPage: (v: number) => void;
}

const RolePagination: React.FC<Props> = ({
  page,
  totalPages,
  setPage,
}) => {
  return (
    <div className="flex gap-3 mt-4">
      <button disabled={page === 1} onClick={() => setPage(page - 1)}>
        Prev
      </button>

      <span>
        {page} / {totalPages || 1}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default RolePagination;