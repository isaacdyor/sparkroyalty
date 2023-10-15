import React, { useEffect, useRef, useState } from "react";
import { BsTrash3 } from "react-icons/bs";
import MoreInfo from "../shared/moreInfo";
import AutoComplete from "../shared/autoComplete";
import { skillSuggestions } from "~/utils/searchSuggestions";

const InvestmentSkill: React.FC<{
  skills: string[];
  setSkills: (skills: string[]) => void;
}> = ({ skills, setSkills }) => {
  const [showTrash, setShowTrash] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);

  const canAddSkill = (skill: string) => {
    return skill !== "";
  };

  const addSkill = () => {
    const lastSkill = skills[skills.length - 1];
    if (canAddSkill(lastSkill!)) {
      setSkills([...skills, ""]);
    }
  };

  const updateSkill = (index: number, value: string) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = value;
    setSkills(updatedSkills);
  };

  const deleteSkill = (index: number) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    setSkills(updatedSkills);
  };

  const handleSuggestionClickVoid = (
    e: React.MouseEvent<HTMLLIElement>,
    suggestion: string
  ) => {
    e.preventDefault();
    updateSkill(activeSuggestion, suggestion);

    setShowSuggestions(false);
  };

  const refs = useRef<React.RefObject<HTMLDivElement>[]>([]);

  useEffect(() => {
    refs.current = skills.map(() => React.createRef<HTMLDivElement>());
  }, [skills]);

  // const inputRefs = skills.map(() => useRef<HTMLDivElement | null>(null));

  return (
    <div className="">
      <MoreInfo
        label="Suggested Skills"
        infoText="Add skills it would help for the worker to have."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {skills.map((skill, index) => (
          <div
            key={index}
            ref={refs.current[index]}
            className="group relative flex w-full items-start"
          >
            <input
              type="text"
              value={skill}
              onFocus={() => {
                setShowSuggestions(true);
                setActiveSuggestion(index);
              }}
              onMouseEnter={() => {
                setShowTrash(index);
              }}
              onMouseLeave={() => {
                setShowTrash(-1);
                console.log("mouse leave");
              }}
              onChange={(e) => updateSkill(index, e.target.value)}
              className="input w-full rounded bg-input px-4 py-2 pr-10 text-white " // Add pr-10 for padding on the right
              placeholder="Enter skill"
              required
            />
            {index === activeSuggestion && (
              <div className="">
                <AutoComplete
                  suggestions={suggestions}
                  setSuggestions={setSuggestions}
                  showSuggestions={showSuggestions}
                  query={skill}
                  setShowSuggestions={setShowSuggestions}
                  suggestionList={skillSuggestions}
                  inputRef={refs.current[index]}
                  handleSuggestionClick={handleSuggestionClickVoid}
                />
              </div>
            )}

            {skills.length > 1 && (
              <button
                type="button"
                className={`absolute right-2 top-3 text-input group-hover:text-gray-600`} // Adjust the positioning
                onClick={() => deleteSkill(index)}
              >
                <BsTrash3 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addSkill}
        className={`mb-4 mt-4 rounded bg-blue-500 px-4 py-2 font-semibold text-white ${
          !canAddSkill(skills[skills.length - 1]!)
            ? "cursor-not-allowed opacity-50"
            : "hover:bg-blue-600"
        }`}
        disabled={!canAddSkill(skills[skills.length - 1]!)}
      >
        Add Skill
      </button>
    </div>
  );
};

export default InvestmentSkill;
