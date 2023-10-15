import React, { useEffect, useRef, useState } from "react";
import countries from "~/utils/countries";

interface CountryInputProps {
  country: string;
  setCountry: (value: string) => void;
}

const CountryInput: React.FC<CountryInputProps> = ({ country, setCountry }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [text, setText] = useState(country);

  const filteredCountries = countries.filter((c) =>
    c.toLowerCase().includes(filter.toLowerCase())
  );
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setText(country);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [country]);

  return (
    <div className="relative mb-4 inline-block w-full text-left">
      <label className="mb-2 block text-white">Country</label>
      <div className="flex flex-col" ref={dropdownRef}>
        <input
          type="text"
          className="rounded bg-input px-4 py-2 text-white  focus:outline-none"
          value={text}
          onFocus={() => {
            setIsOpen(true);
            setFilter("");
          }}
          onChange={(e) => {
            setFilter(e.target.value);
            setText(e.target.value);
          }}
          placeholder="Select a country"
        />

        {isOpen && (
          <select
            className="rounded bg-neutral-800 px-4 py-2 text-white focus:outline-none"
            value={country}
            required
            onSelect={() => setIsOpen(false)}
            onChange={(e) => {
              console.log(e.target.value);
              setCountry(e.target.value);
              setIsOpen(false); // Close the dropdown
              setFilter(e.target.value);
              setText(e.target.value);
            }}
            size={5} // Set the size attribute to display 5 options at a time
          >
            <option value="">Select a country</option>
            {filteredCountries.map((c) => (
              <option
                key={c}
                value={c}
                style={{
                  WebkitAppearance: "none",
                }}
                className={` ${
                  country === c ? "bg-neutral-600" : "hover:bg-neutral-700"
                } bg-neutral-800 text-white hover:cursor-pointer `}
              >
                {c}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default CountryInput;
