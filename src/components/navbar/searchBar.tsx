import router from "next/router";
import React, { useRef, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import { searchSuggestions } from "~/utils/searchSuggestions";
import AutoComplete from "../shared/autoComplete";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleSuggestionClick = async (
    e: React.MouseEvent<HTMLLIElement>,
    suggestion: string
  ) => {
    e.preventDefault();
    setQuery("");
    setShowSuggestions(false);
    await router.push(`/investments?query=${suggestion}`);
  };

  const handleSuggestionClickVoid = (
    e: React.MouseEvent<HTMLLIElement>,
    suggestion: string
  ) => {
    handleSuggestionClick(e, suggestion).catch((err) => {
      console.error("Error router", err);
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    query: string
  ) => {
    e.preventDefault();
    await router.push(`/investments?query=${query}`);
    setQuery("");
    setShowSuggestions(false);
  };

  return (
    <form
      onSubmit={(e) => {
        handleSubmit(e, query).catch((err) => {
          console.error("Error router", err);
        });
      }}
      className="flex h-6 grow items-center space-x-6"
    >
      <div className="flex grow " ref={dropdownRef}>
        <div className="group relative flex grow rounded-l-3xl border border-border focus-within:border-blue-500">
          <input
            type="text"
            className=" grow rounded-l-3xl bg-background py-2 pl-4 focus:outline-none"
            placeholder="What service would you like to provide?"
            value={query}
            onFocus={() => {
              setShowSuggestions(true);
            }}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />

          <AutoComplete
            suggestions={suggestions}
            setSuggestions={setSuggestions}
            showSuggestions={showSuggestions}
            query={query}
            setShowSuggestions={setShowSuggestions}
            suggestionList={searchSuggestions}
            inputRef={dropdownRef}
            handleSuggestionClick={handleSuggestionClickVoid}
          />

          {query ? (
            <button
              type="button"
              className=" text-gray-600 hover:text-gray-400"
              onClick={(e) => {
                e.preventDefault();
                setQuery("");
              }}
            >
              <RxCross2 className="h-6 w-6" />
            </button>
          ) : (
            <div className="h-6 w-6"></div>
          )}
        </div>
        {query ? (
          <button
            type="submit"
            className="rounded-r-3xl bg-secondary px-1 hover:bg-secondary/70"
          >
            <AiOutlineSearch className=" mr-1 h-7 w-7 p-1 text-white" />
          </button>
        ) : (
          <button
            onClick={(e) => e.preventDefault()}
            className="rounded-r-3xl bg-secondary px-1 hover:bg-secondary/70"
          >
            <AiOutlineSearch className=" mr-1 h-7 w-7 p-1 text-white" />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
