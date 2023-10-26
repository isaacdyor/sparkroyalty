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
      className="flex h-6 grow items-center"
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
            <div className="flex items-center">
              <RxCross2
                onClick={(e) => {
                  e.preventDefault();
                  setQuery("");
                }}
                className="h-6 w-6  text-slate-700 hover:cursor-pointer hover:text-slate-600"
              />
            </div>
          ) : (
            <div className="h-6 w-6"></div>
          )}
        </div>
        <button
          type="submit"
          disabled={!query}
          className="rounded-r-3xl bg-secondary px-1 hover:bg-secondary/70"
        >
          <AiOutlineSearch className=" mr-1 h-7 w-7 p-1 text-white" />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
