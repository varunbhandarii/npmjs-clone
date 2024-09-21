import React, { useState, useEffect } from "react";
import { formatDistanceToNowStrict, parseISO } from "date-fns";
import { searchPackages } from "../api/npmApi";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../styles/searchPage.css";

const SearchResultsPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [sortBy, setSortBy] = useState("optimal");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get("q");
  const page = parseInt(searchParams.get("page") || "1", 10);

  let title = document.title;
  if (!title.includes(query)) {
    document.title = query + " - " + title + " search";
  }

  useEffect(() => {
    if (!query) return;

    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await searchPackages(query, page, 20, sortBy);
        setResults(data.objects);
        setTotalResults(data.total);
      } catch (err) {
        setError("Failed to fetch search results.");
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, page, sortBy]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handlePageChange = (newPage) => {
    navigate(`/search?q=${query}&page=${newPage}`);
  };

  const totalPages = Math.ceil(totalResults / 20);

  const renderPagination = () => {
    const pagination = [];
    const pageRange = 2; // Show 2 pages before and after the current page

    // Always render the "Previous" button if not on page>3
    if (page > 3) {
      pagination.push(
        <button
          key="prev"
          onClick={() => handlePageChange(page - 1)}
          className="bg-white px-3 so-sans border border-[#cfcfcf] text-[#666666] hover:bg-[#f8f8f8] rounded-sm"
        >
          «
        </button>
      );
    }

    // Always render the first page
    pagination.push(
      <button
        key={1}
        onClick={() => handlePageChange(1)}
        className={`bg-white so-sans border text-lg border-[#cfcfcf] hover:bg-[#f8f8f8] px-3 rounded-sm ${
          1 === page ? "font-bold text-black" : "text-[#666666]"
        }`}
      >
        1
      </button>
    );

    // Render ellipses before the current page range if necessary
    if (page > pageRange + 2) {
      pagination.push(
        <span className="mt-3" key="start-ellipsis">
          …
        </span>
      );
    }

    // Render pages around the current page
    for (
      let i = Math.max(2, page - pageRange);
      i <= Math.min(totalPages - 1, page + pageRange);
      i++
    ) {
      pagination.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`bg-white so-sans border text-lg border-[#cfcfcf] hover:bg-[#f8f8f8] px-3 rounded-sm ${
            i === page ? "font-bold text-black" : "text-[#666666]"
          }`}
        >
          {i}
        </button>
      );
    }

    // Render ellipses after the current page range if necessary
    if (page < totalPages - pageRange - 1) {
      pagination.push(
        <span className="mt-3" key="end-ellipsis">
          …
        </span>
      );
    }

    // Always render the last page if there is more than one page
    if (totalPages > 1) {
      pagination.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`bg-white so-sans border text-lg border-[#cfcfcf] hover:bg-[#f8f8f8] px-3 rounded-sm ${
            totalPages === page ? "font-bold text-black" : "text-[#666666]"
          }`}
        >
          {totalPages}
        </button>
      );
    }

    // Always render the "Next" button if not on the last <2 page
    if (page + 2 < totalPages) {
      pagination.push(
        <button
          key="next"
          onClick={() => handlePageChange(page + 1)}
          className="bg-white px-3 so-sans border border-[#cfcfcf] text-[#666666] hover:bg-[#f8f8f8] rounded-sm"
        >
          »
        </button>
      );
    }

    return pagination;
  };

  return (
    <div className="">
      <div className="b-bot flex justify-between px-8 bg-[#f9f9f9]">
        <h2 className="text-xl py-6 font-semibold so-sans">
          {totalResults} packages found
        </h2>
        <div className="flex justify-center space-x-2 my-[19px]">
          {/* Pagination Controls */}
          {renderPagination()}
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="px-8 flex">
        <div className="min-w-fit mr-3">
          <div className="font-semibold so-sans pb-2">Sort Packages</div>
          <div className="pl-2">
            <div>
              <input
                type="radio"
                name="sort"
                id="optimal"
                value="optimal"
                checked={sortBy === "optimal"}
                onChange={handleSortChange}
              />
              <label
                htmlFor="optimal"
                className="w-[200px] mr-8 inline-block text-[#4c4c4c] pb-1 ml-2 so-sans font-semibold hover:text-black transition border-b border-b-[#bbbbbb]"
              >
                Optimal
              </label>
            </div>
            <div className="mt-3">
              <input
                type="radio"
                name="sort"
                id="popularity"
                value="popularity"
                checked={sortBy === "popularity"}
                onChange={handleSortChange}
              />
              <label
                htmlFor="popularity"
                className="w-[200px] mr-8 inline-block text-[#4c4c4c] pb-1 ml-2 so-sans font-semibold hover:text-black transition border-b border-b-[#29abe2]"
              >
                Popularity
              </label>
            </div>
            <div className="mt-3">
              <input
                type="radio"
                name="sort"
                id="quality"
                value="quality"
                checked={sortBy === "quality"}
                onChange={handleSortChange}
              />
              <label
                htmlFor="quality"
                className="w-[200px] mr-8 inline-block text-[#4c4c4c] pb-1 ml-2 so-sans font-semibold hover:text-black transition border-b border-b-[#8956ff]"
              >
                Quality
              </label>
            </div>
            <div className="mt-3">
              <input
                type="radio"
                name="sort"
                id="maintenance"
                value="maintenance"
                checked={sortBy === "maintenance"}
                onChange={handleSortChange}
              />
              <label
                htmlFor="maintenance"
                className="w-[200px] mr-8 inline-block text-[#4c4c4c] pb-1 ml-2 so-sans font-semibold hover:text-black transition border-b border-b-[#cb3837]"
              >
                Maintenance
              </label>
            </div>
          </div>
        </div>
        <ul className="space-y-3 pt-6">
          {results.map((pkg) => (
            <li key={pkg.package.name} className="border-b rounded-md">
              <a
                href={`/package/${pkg.package.name}`}
                className="text-xl so-sans font-semibold hover:underline"
              >
                {pkg.package.name}
              </a>
              <p className="mt-1 so-sans text-[#666666]">
                {pkg.package.description}
              </p>
              <div className="my-2 flex flex-wrap gap-y-2">
                {pkg.package.keywords && Array.isArray(pkg.package.keywords) ? (
                  pkg.package.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="text-sm mr-2 bg-[#f2f2f2] p-[2px] px-2 rounded-md hover:bg-[#e5e5e5]"
                    >
                      {keyword}
                    </span>
                  ))
                ) : (
                  <div></div>
                )}
              </div>

              <div className="flex pt-2 pb-5">
                <a
                  href="/"
                  className="fira text-sm text-[#4c4c4c] font-semibold hover:text-[#c82928]"
                >
                  {pkg.package.publisher.username}
                </a>
                <p className="pl-2 fira text-sm text-[#666666]">
                  published {pkg.package.version} •{" "}
                  {formatDistanceToNowStrict(parseISO(pkg.package.date), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-center space-x-2 mt-6">
        {renderPagination()}
      </div>
    </div>
  );
};

export default SearchResultsPage;
