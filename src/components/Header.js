import React, { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import { searchPackages } from "../api/npmApi";
import "../styles/header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faSearch } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const resultsRef = useRef();

  const debouncedFetchSuggestions = debounce(
    async (inputValue, setResults, setLoading, setError, searchPackages) => {
      if (!inputValue.trim()) {
        setResults([]); // Reset results if input is empty
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await searchPackages(inputValue);
        setResults(data.objects.slice(0, 10)); // Limit to 10 suggestions
      } catch (err) {
        setError("Failed to fetch suggestions");
      } finally {
        setLoading(false);
      }
    },
    300
  ); // 300ms delay

  const fetchSuggestions = useCallback(
    (inputValue) => {
      debouncedFetchSuggestions(
        inputValue,
        setResults,
        setLoading,
        setError,
        searchPackages
      );
    },
    [setResults, setLoading, setError, searchPackages] // Dependencies
  );

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setQuery(inputValue);
    fetchSuggestions(inputValue);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) {
      navigate(`/`);
      return;
    }
    navigate(`/search?q=${query}`);
    setResults([]); // Clear results after search
  };

  // Handle click outside to close results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target)) {
        setResults([]); // Clear results when clicking outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Cleanup event listener
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [resultsRef]);

  return (
    <div>
      <div className="gradient" />
      <ul className="nav1">
        <li>
          <FontAwesomeIcon icon={faHeart} className="text-black" />
        </li>
        <li>Pro</li>
        <li>Teams</li>
        <li>Pricing</li>
        <li>Documentation</li>
      </ul>
      <header className="p-5 relative shadow-md">
        <div className="flex justify-evenly items-center relative">
          <a href="/" className="text-4xl font-bold npm so-sans">
            npm
          </a>
          <div className="relative w-9/12">
            <form onSubmit={handleSearch} className="flex">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <FontAwesomeIcon
                    icon={faSearch}
                    className="text-gray-500 font-thin"
                  />
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={handleInputChange}
                  placeholder="Search packages"
                  className="border pl-11 py-3 w-full bg-[#f2f2f2] fira focus:outline-none focus:border-black border-[#f2f2f2]"
                />
                {/* Results dropdown */}
                {results.length > 0 && (
                  <ul
                    ref={resultsRef} // Reference to the results container
                    className="absolute left-0 right-0 bg-white z-10"
                  >
                    {results.map((pkg) => (
                      <li
                        key={pkg.package.name}
                        className="p-2 border-b hover:bg-[#f2f2f2]"
                      >
                        <a
                          href={`/package/${pkg.package.name}`}
                          className="flex justify-between items-center"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="so-sans font-bold -my-[5px]">
                              {pkg.package.name}
                            </p>
                            <p className="truncate so-sans -my-[4px]">
                              {pkg.package.description}
                            </p>
                          </div>
                          <p className="ml-4 so-sans flex-shrink-0">
                            {pkg.package.version}
                          </p>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button
                type="submit"
                className="bg-black text-white px-8 py-3 text-[14px] poppins font-bold"
              >
                Search
              </button>
            </form>
          </div>

          <p className="hovera poppins px-7 py-3 border-[1px] border-gray-300 hover:border-gray-200 transition-colors duration-300">
            Sign Up
          </p>
          <p className="pr-6 hovera poppins">Sign In</p>
        </div>
      </header>
    </div>
  );
};

export default Header;
