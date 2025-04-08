import React, { useState, useRef, useEffect } from "react";

/**
 * A custom email input component specifically for MNNIT email addresses,
 * where the user only enters the username part.
 *
 * @param {object} props - The component props.
 * @param {string} props.name - A unique name for the input element (used for form submission and generating unique IDs). This *must* be unique for each instance of this component on a page.
 * @param {boolean} [props.required=true] - Whether the input is required.
 * @param {string} [props.autoComplete="username"] - The autocomplete attribute value for the username input. Consider "email" for the hidden input if needed.
 * @param {function} [props.onChange] - Callback function triggered when the effective email value changes. Receives an event-like object: { target: { name, value } }.
 * @param {string} [props.label="Email"] - The label text displayed above the input.
 * @param {string} [props.initialUsername=""] - The initial value for the username part of the email.
 * @param {string} [props.domain="@mnnit.ac.in"] - The domain to append (can be overridden if needed, though likely static).
 */
const CustomEmailInput = ({
  name,
  required = true,
  autoComplete = "username", // Can be overridden, e.g., "off", "new-password" contextually
  onChange,
  label = "Email",
  initialUsername = "",
  domain = "@mnnit.ac.in", // Made it a prop for flexibility, though likely fixed
}) => {
  const [username, setUsername] = useState(initialUsername);
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  // --- Generate unique IDs based on the name prop ---
  const inputId = `${name}-input`;
  const errorId = `${name}-error`;
  const hintId = `${name}-hint`;
  // ---

  // --- Effect to notify parent component of the full email value change ---
  useEffect(() => {
    if (onChange) {
      // Only include domain if username is not empty
      const fullEmail = username ? username + domain : "";
      onChange({ target: { name, value: fullEmail } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, name, domain]); // Include domain if it can change via props
  // Note: 'onChange' is intentionally omitted from deps to prevent potential infinite loops
  // if the parent component re-creates the function on every render.
  // The effect should run when the *data* (username, name, domain) changes.
  // ---

  // --- Event Handlers ---
  const handleUsernameChange = (e) => {
    const value = e.target.value;

    // Allow empty input without validation error
    if (value === "") {
      setUsername("");
      setError("");
      return; // Exit early
    }

    // Basic validation: allow letters, numbers, dots (.), and underscores (_)
    // Allow intermediate invalid states while typing for better UX, but validate the pattern
    if (/^[a-zA-Z0-9_.]*$/.test(value)) {
      setUsername(value);
      // Clear error immediately if the input becomes potentially valid
      // Re-validate on blur or submit if stricter validation is needed
      setError("");
    } else {
      // If the pattern is definitely broken (e.g., contains disallowed chars)
      setUsername(value); // Still show the invalid input
      setError(
        "Username can only contain letters (a-z, A-Z), numbers (0-9), dots (.), and underscores (_)."
      );
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Optional: Add stricter validation on blur if needed
    if (username && !/^[a-zA-Z0-9_.]+$/.test(username)) {
      setError(
        "Username contains invalid characters. Allowed: letters, numbers, dots, underscores."
      );
    } else if (required && !username) {
      setError("This field is required.");
    } else {
      // Clear error if valid on blur
      if (error && /^[a-zA-Z0-9_.]+$/.test(username)) {
        setError("");
      }
    }
  };

  const handleContainerClick = () => {
    inputRef.current?.focus(); // Use optional chaining for safety
  };

  const handleClearClick = (e) => {
    e.stopPropagation(); // Prevent container click handler from firing and refocusing
    setUsername("");
    setError(""); // Clear any errors associated with the previous value
    inputRef.current?.focus(); // Focus the input after clearing
  };
  // ---

  // Construct the full email value for the hidden input
  const fullEmailValue = username ? username + domain : "";

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Hidden actual email input that will be submitted with the form */}
      {/* You might want autocomplete="email" here if this *represents* the email field */}
      <input type="hidden" name={name} value={fullEmailValue} />

      {/* Label above the input */}
      <label
        htmlFor={inputId} // Use dynamic ID
        className="block text-sm font-medium text-purple-700 mb-2"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Input container */}
      <div
        onClick={handleContainerClick}
        // Consider adding role="button" and keyboard handlers (onKeyDown for Space/Enter)
        // if you want the *entire* container to be focusable and clickable like a button.
        // However, standard behavior is for the input itself to be focusable via Tab.
        className={`flex items-center w-full overflow-hidden bg-white/5 rounded-lg text-white shadow-sm transition-all duration-150 ease-in-out ${
          isFocused
            ? "ring-2 ring-purple-500 border-purple-500" // Use border color consistent with ring
            : error
            ? "border-red-500 ring-1 ring-red-500" // Use border+ring for error
            : "border border-white/20 hover:border-white/30"
        }`}
        style={{
          borderColor: isFocused ? "#a855f7" : error ? "#ef4444" : undefined,
        }} // Explicit border color override if needed for specificity
      >
        {/* Username text input section */}
        <div className="relative flex-grow">
          <input
            id={inputId} // Use dynamic ID
            ref={inputRef}
            type="text"
            value={username}
            onChange={handleUsernameChange}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur} // Use blur handler for validation/state changes
            placeholder="name.registration_number"
            className={`w-full p-3 md:p-4 bg-transparent focus:outline-none text-white placeholder-gray-400 ${
              username ? "text-white" : "text-gray-400" // Style based on whether there's input
            }`}
            required={required} // HTML5 required attribute
            autoComplete={autoComplete} // Use the prop
            aria-label={`${label} Username`} // More specific ARIA label
            // Dynamically link hint and error message using their unique IDs
            aria-describedby={`${hintId}${error ? ` ${errorId}` : ""}`}
            aria-invalid={!!error} // Indicate invalid state for screen readers
          />
          {/* Clear button */}
          {username && (
            <button
              type="button"
              className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-white focus:outline-none focus:ring-1 focus:ring-purple-400 rounded-full p-0.5" // Adjusted positioning and focus style
              onClick={handleClearClick}
              aria-label="Clear username input" // Specific label for the button's action
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true" // Hide decorative icon from screen readers
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

        {/* Domain part (read-only) */}
        <div className="py-3 px-3 md:px-4 bg-white/10 text-gray-300 whitespace-nowrap font-mono text-sm md:text-base flex-shrink-0">
          {domain}
        </div>
      </div>

      {/* Error message area */}
      {/* Use role="alert" for dynamic errors to be announced by screen readers */}
      <div className="min-h-[1.25rem] mt-1">
        {" "}
        {/* Reserve space to prevent layout shifts */}
        {error && (
          <p id={errorId} className="text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>

      {/* Helper text / Hint */}
      <div className="mt-2 flex items-start">
        <div className="flex-shrink-0 mt-0.5">
          {/* Info Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-purple-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p id={hintId} className="ml-2 text-xs md:text-sm text-gray-400">
          {" "}
          {/* Use dynamic ID */}
          Enter only your username (e.g.,{" "}
          <span className="font-medium text-purple-400">john.2022ca045</span>).
          The domain <span className="font-mono text-purple-400">{domain}</span>{" "}
          will be appended automatically.
        </p>
      </div>

      {/* Preview of the full email (optional) */}
      {username && (
        <div className="mt-3 p-2 bg-purple-900/20 border border-purple-500/30 rounded text-sm text-purple-300 font-mono break-all">
          <span className="font-normal text-gray-400">Email preview: </span>
          {username}
          <span className="text-purple-400">{domain}</span>
        </div>
      )}
    </div>
  );
};

export default CustomEmailInput;
