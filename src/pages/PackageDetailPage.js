import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPackageDetails } from "../api/npmApi";
import { formatDistanceToNowStrict, parseISO } from "date-fns";
import ReactMarkdown from "react-markdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileLines,
  faCube,
  faTags,
  faChevronRight,
  faCopy,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/packageDetail.css";

const PackageDetailPage = () => {
  const { packageName } = useParams();
  const [packageData, setPackageData] = useState(null);
  const [activeTab, setActiveTab] = useState("readme");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  let title = document.title;
  if (!title.includes(packageName)) {
    document.title = packageName + " - " + title;
  }

  useEffect(() => {
    const fetchPackageDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getPackageDetails(packageName);
        setPackageData(data);
      } catch (err) {
        setError("Failed to load package details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPackageDetails();
  }, [packageName]);

  if (loading) return <p>Loading...</p>;
  if (error)
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );

  if (!loading && !packageData) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-red-500">
          Package "<strong>{packageName}</strong>" not found.
        </p>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "readme":
        return (
          <div className="mt-4 w-full">
            {packageData.readme ? (
              <ReactMarkdown>{packageData.readme}</ReactMarkdown>
            ) : (
              <p className="so-sans text-[#333333]">
                No README available for this package.
              </p>
            )}

            <h3 className="text-xl so-sans font-semibold pt-10 pb-4">
              Keywords
            </h3>
            <hr className="" />
            <div className="pt-6 flex flex-wrap gap-3">
              {packageData.keywords ? (
                packageData.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="text-[#cb3837] hover:text-black transition so-sans font-semibold text-xl"
                  >
                    {keyword}
                  </span>
                ))
              ) : (
                <p className="so-sans">None</p>
              )}
            </div>
          </div>
        );
      case "dependencies":
        const latestVersion =
          packageData.versions[packageData["dist-tags"].latest];
        const dependencies = latestVersion?.dependencies || {};
        return (
          <div className="">
            <h3 className="text-xl so-sans font-semibold pt-10 pb-4">
              Dependencies ({Object.keys(dependencies).length})
            </h3>
            <hr className="" />
            <div className="pt-6 flex flex-wrap gap-3">
              {Object.keys(dependencies).length > 0 ? (
                Object.keys(dependencies).map((dep) => (
                  <span
                    key={dep}
                    className="text-[#cb3837] hover:text-black transition so-sans font-semibold text-xl"
                  >
                    {dep}
                  </span>
                ))
              ) : (
                <p className="so-sans"></p>
              )}
            </div>
          </div>
        );
      case "versions":
        const versions = packageData.versions || {};
        return (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Versions</h3>
            <ul>
              {Object.keys(versions).map((version) => (
                <li key={version}>{version}</li>
              ))}
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-14 py-11">
      {packageData && (
        <>
          <h1 className="text-2xl font-semibold mb-2">{packageData.name}</h1>
          <p className="text-[#333333] mb-4 fira text-sm">
            {packageData["dist-tags"].latest} • Published{" "}
            {formatDistanceToNowStrict(parseISO(packageData.time.modified), {
              addSuffix: true,
            })}
          </p>

          {/* Tabs Navigation */}
          <div className="mt-6">
            <button
              className={`px-14 border-b-2 border-[#ffcd3a] so-sans py-3 rounded-sm font-semibold text-[#886702] ${
                activeTab === "readme" ? "bg-[#fff5db]" : "hover:bg-[#fff9e5]"
              }`}
              onClick={() => setActiveTab("readme")}
            >
              <FontAwesomeIcon icon={faFileLines} className="pr-2" /> Readme
            </button>
            <button
              className={`px-14 border-b-2 border-[#c836c3] so-sans py-3 rounded-sm font-semibold text-[#782075] ${
                activeTab === "dependencies"
                  ? "bg-[#f6d8f4]"
                  : "hover:bg-[#faeaf9]"
              }`}
              onClick={() => setActiveTab("dependencies")}
            >
              <FontAwesomeIcon icon={faCube} className="pr-2" />{" "}
              {
                Object.keys(
                  packageData.versions[packageData["dist-tags"].latest]
                    .dependencies || {}
                ).length
              }{" "}
              {Object.keys(
                packageData.versions[packageData["dist-tags"].latest]
                  .dependencies || {}
              ).length === 1
                ? "Dependency"
                : "Dependencies"}
            </button>
            <button
              className={`px-14 border-b-2 border-[#29abe2] so-sans py-3 rounded-sm font-semibold text-[#136c91] ${
                activeTab === "versions" ? "bg-[#d9eff9]" : "hover:bg-[#e8f6fc]"
              }`}
              onClick={() => setActiveTab("versions")}
            >
              <FontAwesomeIcon icon={faTags} className="pr-2" />{" "}
              {Object.keys(packageData.versions || {}).length}{" "}
              {Object.keys(packageData.versions || {}).length === 1
                ? "Version"
                : "Versions"}
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex justify-between">
            <div className="w-[68%] pr-8">{renderTabContent()}</div>
            <div className="w-[32%]">
              <h3 className="pt-4 text-base font-semibold so-sans text-[#757575]">
                Install
              </h3>
              <div>
                <div className="border border-[#cccccc] p-2 pb-3 rounded-md mt-3 flex justify-between">
                  <div>
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="ml-3 text-sm pr-2"
                    />{" "}
                    <code className="text-sm ">npm i {packageData.name}</code>
                  </div>
                  <button
                    className="text-[#333333]"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `npm i ${packageData.name}`
                      );
                    }}
                  >
                    <FontAwesomeIcon className="mr-3 text-sm" icon={faCopy} />
                  </button>
                </div>
              </div>
              <div className="flex">
                <div className="w-1/2">
                  <h3 className="pt-8 text-base font-semibold so-sans pb-1 text-[#757575]">
                    Version
                  </h3>
                  <p className="so-sans font-semibold text-xl">
                    {packageData["dist-tags"].latest}
                  </p>
                </div>
                <div>
                  <h3 className="pt-8 pb-1 text-base font-semibold so-sans text-[#757575]">
                    License
                  </h3>
                  <p className="so-sans font-semibold text-xl">
                    {packageData.license}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PackageDetailPage;
