"use client";
import { useRef, useState } from "react";

const ChatForm = () => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const processFiles = async (event) => {
    setError("");

    const formData = new FormData();
    for (const file of event.target.files) {
      formData.append("file", file);
    }

    try {
      const response = await fetch("/api/chat-analysis", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "An unknown error occurred");
        setResults([]);
        return;
      }

      const data = await response.json();

      setResults(data);

      event.target.value = "";
    } catch (error) {
      console.error("Error processing files:", error);
      setError("An error occurred while processing files.");
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="pt-8 flex flex-col items-center gap-y-5 w-full">
      <input
        type="file"
        accept=".txt"
        ref={fileInputRef}
        multiple
        className="hidden"
        onChange={processFiles}
      />

      <button
        onClick={handleButtonClick}
        className="bg-blue-500 p-2 rounded-lg hover:bg-blue-700 w-[100px] text-white"
      >
        Upload
      </button>

      {error && <p className="text-red-500">{error}</p>}

      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 w-full">
        {results.map((result, index) => (
          <div
            className="bg-gray-200 w-full lg:w-[500px] h-[200px] rounded-md text-gray-700 p-4 overflow-auto"
            key={index}
          >
            <h2 className="font-semibold text-gray-800 text-lg pb-6">
              File name: {result.fileName}
            </h2>
            <ul>
              {result.topUsers.map((user, idx) => (
                <li key={idx}>
                  {user[0]}: {user[1]} words
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatForm;
