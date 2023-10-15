import React, { useState } from "react";

interface TextAreaProps {
  text: string;
  setText: (text: string) => void;
  placeHolder: string;
}

const TextArea: React.FC<TextAreaProps> = ({ text, setText, placeHolder }) => {
  const [showCharacterCount, setShowCharacterCout] = useState(false);

  const maxCharacterCount = 1000;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (
      text.length < maxCharacterCount ||
      e.target.value.length < text.length
    ) {
      setText(e.target.value);
    }
  };
  return (
    <div>
      <textarea
        value={text}
        onChange={handleChange}
        placeholder={placeHolder}
        onFocus={() => setShowCharacterCout(true)}
        onBlur={() => setShowCharacterCout(false)}
        required
        className="input w-full rounded bg-neutral-800 px-4 py-2 text-white hover:bg-neutral-700 focus:h-48"
      />
      {showCharacterCount && (
        <p className="flex justify-end text-gray-400">
          Characters remaining: {maxCharacterCount - text.length}/
          {maxCharacterCount}
        </p>
      )}
    </div>
  );
};

export default TextArea;
