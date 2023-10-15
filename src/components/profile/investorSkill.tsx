import React, { useEffect, useRef, useState } from "react";
import { ExperienceLevelType } from "@prisma/client";
import AutoComplete from "../shared/autoComplete";
import { skillSuggestions } from "~/utils/searchSuggestions";
import { BsTrash3 } from "react-icons/bs";

interface Skill {
  skill: string;
  experience: ExperienceLevelType | "";
}

interface SkillComponentProps {
  skills: Skill[];
  setSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
}

const InvestorSkill: React.FC<SkillComponentProps> = ({
  skills,
  setSkills,
}) => {
  const [showTrash, setShowTrash] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);

  const canAddSkill = (skill: Skill) => {
    return skill.skill.trim() !== "" && skill.experience !== "";
  };

  const addSkill = () => {
    const lastSkill = skills[skills.length - 1];
    if (canAddSkill(lastSkill!)) {
      setSkills([...skills, { skill: "", experience: "" }]);
    }
  };

  const deleteSkill = (index: number) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    setSkills(updatedSkills);
  };

  const updateSkill = (
    index: number,
    field: keyof Skill,
    value: ExperienceLevelType | string
  ) => {
    const updatedSkills = [...skills];
    if (field === "experience") {
      updatedSkills[index]![field] = value as ExperienceLevelType;
    } else {
      updatedSkills[index]![field] = value;
    }
    setSkills(updatedSkills);
  };

  const handleSuggestionClickVoid = (
    e: React.MouseEvent<HTMLLIElement>,
    suggestion: string
  ) => {
    e.preventDefault();
    updateSkill(activeSuggestion, "skill", suggestion);

    setShowSuggestions(false);
  };

  const refs = useRef<React.RefObject<HTMLDivElement>[]>([]);

  useEffect(() => {
    refs.current = skills.map(() => React.createRef<HTMLDivElement>());
  }, [skills]);

  return (
    <div>
      <label className="text-white">Skills</label>
      {skills.map((skill, index) => (
        <div
          key={index}
          ref={refs.current[index]}
          className="mb-4 flex items-center"
          onMouseEnter={() => {
            setShowTrash(index);
          }}
          onMouseLeave={() => {
            setShowTrash(-1);
          }}
        >
          <div className="flex w-full space-x-2">
            <div className="relative flex w-full items-start ">
              <input
                type="text"
                value={skill.skill}
                onChange={(e) => updateSkill(index, "skill", e.target.value)}
                className="input w-full rounded bg-input px-4 py-2 text-white "
                placeholder="Enter skill"
                onFocus={() => {
                  setActiveSuggestion(index);
                  setShowSuggestions(true);
                }}
                required
              />

              {index === activeSuggestion && (
                <div className="">
                  <AutoComplete
                    suggestions={suggestions}
                    setSuggestions={setSuggestions}
                    showSuggestions={showSuggestions}
                    query={skill.skill}
                    setShowSuggestions={setShowSuggestions}
                    suggestionList={skillSuggestions}
                    inputRef={refs.current[index]}
                    handleSuggestionClick={handleSuggestionClickVoid}
                  />
                </div>
              )}
            </div>

            <select
              value={skill.experience}
              onChange={(e) =>
                updateSkill(
                  index,
                  "experience",
                  e.target.value as ExperienceLevelType
                )
              }
              className={`input w-full rounded bg-input px-4 py-2  ${
                skill.experience === "" ? "text-gray-400" : "text-white"
              }`}
              required
            >
              <option value="" disabled>
                Experience Level
              </option>
              {Object.values(ExperienceLevelType).map((level) => (
                <option key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
            {skills.length > 1 && index === showTrash && (
              <button
                type="button"
                className=" text-gray-300 hover:text-gray-500" // Adjust the positioning
                onClick={() => deleteSkill(index)}
              >
                <BsTrash3 className="h-5 w-5  " />
              </button>
            )}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addSkill}
        className={`mb-4 rounded bg-blue-500 px-4 py-2 font-semibold text-white ${
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

export default InvestorSkill;
