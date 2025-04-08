import React, { useState, useRef, useEffect } from "react";

const CustomEmailInput = ({
  name,
  required = true,
  autoComplete = "username",
  onChange,
  label = "Email",
}) => {
  const [username, setUsername] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const domain = "@mnnit.ac.in";

  useEffect(() => {
    if (onChange) {
      const fullEmail = username + domain;
      onChange({ target: { name, value: fullEmail } });
    }
  }, [username, onChange, name]);

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);

    // Basic validation - you can customize this based on your requirements
    if (value && !/^[a-zA-Z0-9_.]+$/.test(value)) {
      setError(
        "Username can only contain letters, numbers, dots, and underscores"
      );
    } else {
      setError("");
    }
  };

  const handleContainerClick = () => {
    inputRef.current.focus();
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Hidden actual email input that will be submitted with the form */}
      <input type="hidden" name={name} value={username + domain} />

      {/* Label above the input */}
      <label
        htmlFor={`${name}-input`}
        className="block text-sm font-medium text-purple-700 mb-2"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div
        onClick={handleContainerClick}
        className={`flex items-center w-full overflow-hidden bg-white/5 rounded-lg text-white shadow-sm transition-all ${
          isFocused
            ? "ring-2 ring-purple-500 border border-purple-500"
            : error
            ? "border border-red-500"
            : "border border-white/20 hover:border-white/30"
        }`}
      >
        {/* Username input */}
        <div className="relative flex-grow">
          <input
            id={`${name}-input`}
            ref={inputRef}
            type="text"
            value={username}
            onChange={handleUsernameChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="name.registration_number"
            className={`w-full p-3 md:p-4 bg-transparent focus:outline-none text-white placeholder-gray-400 ${
              username ? "text-white" : "text-gray-400"
            }`}
            required={required}
            autoComplete={autoComplete}
            aria-label="Email username"
            aria-describedby="email-hint email-error"
          />
          {username && (
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              onClick={() => setUsername("")}
              aria-label="Clear input"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Domain part */}
        <div className="py-3 px-3 md:px-4 bg-white/10 text-gray-300 whitespace-nowrap font-mono text-sm md:text-base">
          {domain}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <p id="email-error" className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}

      {/* Helper text */}
      <div className="mt-2 flex items-start">
        <div className="flex-shrink-0 mt-0.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-purple-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p id="email-hint" className="ml-2 text-xs md:text-sm text-gray-400">
          Enter only your username (e.g.,{" "}
          <span className="font-medium text-purple-400">john.2022ca045</span>).
          The domain <span className="font-mono text-purple-400">{domain}</span>{" "}
          will be appended automatically.
        </p>
      </div>

      {/* Preview of full email */}
      {username && (
        <div className="mt-3 p-2 bg-purple-900/20 border border-purple-500/30 rounded text-sm text-purple-300 font-mono">
          <span className="font-normal text-gray-400">Your email: </span>
          {username}
          <span className="text-purple-400">{domain}</span>
        </div>
      )}
    </div>
  );
};

export default CustomEmailInput;
