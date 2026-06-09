import React from "react";

interface Props {
  search: string;
  setSearch: (v: string) => void;
  setPage: (v: number) => void;
}

const RoleSearch: React.FC<Props> = ({ search, setSearch, setPage }) => {
  return (
    <input
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        setPage(1);
      }}
      placeholder="Search roles..."
      className="border p-2 mb-3 w-1/3"
    />
  );
};

export default RoleSearch;