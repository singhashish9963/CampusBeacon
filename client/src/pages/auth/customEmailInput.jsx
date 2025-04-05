import React, { useState, useRef, useEffect } from "react";

const CustomEmailInput = ({ name, required, autoComplete, onChange }) => {
  const [username, setUsername] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const domain = "@mnnit.ac.in";

  useEffect(() => {
    if (onChange) {
      const fullEmail = username + domain;
      onChange({ target: { name, value: fullEmail } });
    }
  }, [username, onChange, name]);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleContainerClick = () => {
    inputRef.current.focus();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Hidden actual email input that will be submitted with the form */}
      <input type="hidden" name={name} value={username + domain} />

      {/* Label above the input */}
      <label className="block text-sm font-medium text-purple-700 mb-1">
        Email
      </label>

      <div
        onClick={handleContainerClick}
        className={`flex items-center w-full p-1 bg-white/5 rounded-lg text-white border ${
          isFocused ? "border-purple-500" : "border-white/10"
        } transition-all`}
      >
        {/* Username input */}
        <input
          ref={inputRef}
          type="text"
          value={username}
          onChange={handleUsernameChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="name.registationNumber"
          className="flex-grow p-3 focus:outline-none text-white"
          required={required}
          autoComplete={autoComplete}
          aria-label="Email username"
        />

        {/* Domain part */}
        <div className=" p-3 text-gray-500 border-l border-gray-300">
          {domain}
        </div>
      </div>

      {/* Helper text */}
      <p className="mt-1 text-xs text-gray-500">
        Make sure you only enter your college email id, it will be automatically
        appended with @mnnit.a.cin
      </p>
    </div>
  );
};

export default CustomEmailInput;
