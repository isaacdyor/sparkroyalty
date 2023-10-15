import React from "react";
import { AiFillCaretRight, AiFillCaretLeft } from "react-icons/ai";

interface PageNavProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}

const PageNav: React.FC<PageNavProps> = ({ page, setPage, totalPages }) => {
  return (
    <div className="mt-8 flex items-center justify-center">
      <button
        className={`flex h-8 w-8 items-center justify-center rounded-full text-white ${
          page !== 1
            ? "bg-blue-600 hover:cursor-pointer hover:bg-blue-700"
            : "bg-blue-400"
        }`}
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
      >
        <AiFillCaretLeft className="mr-1 h-6 w-6" />
      </button>
      <p className="mx-4 text-gray-300">
        Page {page} of {totalPages}
      </p>
      <button
        className={`flex h-8 w-8 items-center justify-center rounded-full  text-white ${
          page !== totalPages
            ? "bg-blue-600 hover:cursor-pointer hover:bg-blue-700"
            : "bg-blue-400"
        } `}
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages}
      >
        <AiFillCaretRight className="ml-1 h-6 w-6" />
      </button>
    </div>
  );
};

export default PageNav;
