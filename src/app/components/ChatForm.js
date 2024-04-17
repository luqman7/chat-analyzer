"use client";
import { useRef, useState } from "react";

const ChatForm = () => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const processFiles = async (event) => {
    fetch("/api/chat-analysis", { method: "POST" });

    const uploadedFiles = Array.from(event.target.files);

    const nonTxtFile = uploadedFiles.find(
      (file) => !file.name.endsWith(".txt")
    );

    if (nonTxtFile) {
      setError("Please upload only .txt files.");
      setResults([]);
      return;
    } else {
      setError("");
    }

    let fileResults = [];

    for (const file of uploadedFiles) {
      const text = await file.text();

      const lines = text.split("\n");

      let userWordCount = {};
      let uniqueUsers = new Set();
      let currentUser = null;
      let currentUserBuffer = "";

      for (const line of lines) {
        const trimmedLine = line.trim();

        if (trimmedLine.startsWith("<")) {
          if (currentUser) {
            const wordCount = currentUserBuffer
              .split(/\s+/)
              .filter(Boolean).length;
            userWordCount[currentUser] =
              (userWordCount[currentUser] || 0) + wordCount;
            currentUserBuffer = "";
          }

          const closingIndex = trimmedLine.indexOf(">");
          if (closingIndex !== -1) {
            currentUser = trimmedLine.slice(1, closingIndex);
            const message = trimmedLine.slice(closingIndex + 1).trim();

            uniqueUsers.add(currentUser);

            currentUserBuffer += message;
          }
        } else {
          if (currentUser) {
            currentUserBuffer += " " + trimmedLine;
          }
        }
      }

      if (currentUser) {
        const wordCount = currentUserBuffer.split(/\s+/).filter(Boolean).length;
        userWordCount[currentUser] =
          (userWordCount[currentUser] || 0) + wordCount;
      }

      const k = uniqueUsers.size;

      const sortedUsers = Object.entries(userWordCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, k);

      fileResults.push({
        fileName: file.name,
        topUsers: sortedUsers,
      });
    }

    setResults(fileResults);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="pt-8 flex flex-col items-center gap-y-5">
      <input
        type="file"
        accept=".txt"
        ref={fileInputRef}
        multiple
        style={{ display: "none" }}
        onChange={processFiles}
      />

      <button
        onClick={handleButtonClick}
        className="bg-blue-500 p-2 rounded-lg hover:bg-blue-700 w-[100px] text-white"
      >
        Upload
      </button>

      {error && <p className="bg-red-500">{error}</p>}

      <div className="flex items-center justify-center gap-6">
        {results.map((result, index) => (
          <div
            className="bg-gray-200 w-[500px] h-[200px] rounded-md text-gray-700 p-4 overflow-auto"
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
