import React, { useRef, useState } from "react";
import MoreInfo from "../shared/moreInfo";
import { searchSuggestions } from "~/utils/searchSuggestions";
import AutoComplete from "../shared/autoComplete";

interface WorkTypeInputProps {
  workType: string;
  setWorkType: React.Dispatch<React.SetStateAction<string>>;
}

const WorkTypeInput: React.FC<WorkTypeInputProps> = ({
  workType,
  setWorkType,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  return (
    <div className="mb-4">
      <MoreInfo
        label="Work type"
        infoText="Type of work you are looking for. For example: Web Development."
      />
      <div className="relative flex w-full items-start" ref={dropdownRef}>
        <input
          type="text"
          placeholder="Type of work you are looking for"
          value={workType}
          onChange={(e) => setWorkType(e.target.value)}
          className="input w-full rounded bg-input px-4 py-2 text-white"
          required
          onFocus={() => {
            setShowSuggestions(true);
          }}
        />
        <AutoComplete
          suggestions={suggestions}
          setSuggestions={setSuggestions}
          showSuggestions={showSuggestions}
          query={workType}
          setShowSuggestions={setShowSuggestions}
          suggestionList={searchSuggestions}
          inputRef={dropdownRef}
          handleSuggestionClick={(e, suggestion) => {
            e.preventDefault();
            setWorkType(suggestion);
            setShowSuggestions(false);
          }}
        />
      </div>
    </div>
  );
};

export default WorkTypeInput;
