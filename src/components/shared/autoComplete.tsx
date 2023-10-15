import React, { useEffect } from "react";
import stringSimilarity from "string-similarity";

interface AutoCompleteProps {
  query: string;
  showSuggestions: boolean;
  setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
  suggestions: string[];
  setSuggestions: React.Dispatch<React.SetStateAction<string[]>>;
  suggestionList: string[];
  // inputRef: React.MutableRefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLDivElement> | undefined;
  handleSuggestionClick: (
    e: React.MouseEvent<HTMLLIElement>,
    suggestion: string
  ) => void;
}

const AutoComplete: React.FC<AutoCompleteProps> = ({
  query,
  showSuggestions,
  setShowSuggestions,
  suggestions,
  setSuggestions,
  suggestionList,
  inputRef,
  handleSuggestionClick,
}) => {
  useEffect(() => {
    const getSimilarSuggestions = (userInput: string): string[] => {
      const exactSuggestions = suggestionList.filter((suggestion) =>
        suggestion.toLowerCase().startsWith(query.toLowerCase())
      );

      // Calculate similarity scores between userInput and suggestions
      const trimmedSuggestions = suggestionList.map((suggestion) =>
        suggestion.slice(0, userInput.length)
      );

      const similarityScores = stringSimilarity.findBestMatch(
        userInput,
        trimmedSuggestions
      );

      const similarSuggestionsWithIndex = similarityScores.ratings
        .map((score, index) => ({ score, index })) // Pair each score with its index
        .filter((pair) => pair.score.rating > 0.3) // Filter based on the score
        .map((pair) => pair.index); // Extract the original indices of filtered elements

      // Extract the suggestions that meet the threshold
      const fuzzySuggestions = similarSuggestionsWithIndex.map(
        (index) => suggestionList[index]!
      );

      const combinedSuggestions = [];

      // Check the length of the first array
      if (exactSuggestions.length >= 5) {
        // If the first array has 5 or more elements, take the first 5 elements
        combinedSuggestions.push(...exactSuggestions.slice(0, 5));
      } else {
        // If the first array has fewer than 5 elements, take all elements from arr1
        combinedSuggestions.push(...exactSuggestions);

        // Calculate how many elements to take from arr2
        let remaining = 5 - exactSuggestions.length;
        for (const suggestion of fuzzySuggestions) {
          if (!combinedSuggestions.includes(suggestion)) {
            combinedSuggestions.push(suggestion);
            remaining--;

            if (remaining === 0) {
              break;
            }
          }
        }
      }

      return combinedSuggestions;
    };
    if (query) {
      const similarSuggestions = getSimilarSuggestions(query);
      setSuggestions(similarSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [query, setSuggestions, suggestionList]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef?.current && !inputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [inputRef, setShowSuggestions]);

  const renderSuggestion = (suggestion: string, index: number) => {
    const parts = suggestion.split(new RegExp(`(${query})`, "gi"));

    return (
      <li
        key={index}
        className={`cursor-pointer rounded-lg px-4 py-2 hover:bg-neutral-800 ${
          index === suggestionList.length - 1 ? "border-b border-gray-600" : ""
        }`}
        onClick={(e) => {
          handleSuggestionClick(e, suggestion);
        }}
      >
        {parts.map((part, partIndex) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={partIndex}>{part}</span>
          ) : (
            <span key={partIndex} className="font-bold">
              {part}
            </span>
          )
        )}
      </li>
    );
  };

  return (
    <>
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute left-0 z-10 mt-11 w-full rounded-lg border border-gray-600 bg-neutral-900">
          <ul>
            {suggestions.map((suggestion, index) => (
              <React.Fragment key={index}>
                {renderSuggestion(suggestion, index)}
              </React.Fragment>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default AutoComplete;
