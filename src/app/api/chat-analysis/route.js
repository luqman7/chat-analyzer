import { NextResponse } from "next/server";
import { resolve } from "path";

export async function POST(req) {
  try {
    const formData = await req.formData();

    if (!formData) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    const fileResults = await processFiles(formData);

    return NextResponse.json(fileResults, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);

    return NextResponse.json(
      { error: "Only .txt file allowed" },
      { status: 500 }
    );
  }
}

async function processFiles(formData) {
  const fileResults = [];

  for (const entry of formData.entries()) {
    const [fieldName, file] = entry;

    if (file instanceof File) {
      if (!file.name.endsWith(".txt")) {
        throw new Error("Only .txt files are allowed.");
      }

      const fileContent = await file.text();

      const topUsers = analyzeChatContent(fileContent);

      fileResults.push({
        fileName: file.name,
        topUsers,
      });
    }
  }

  return fileResults;
}

function analyzeChatContent(text) {
  const userWordCount = {};
  const lines = text.split("\n");
  let currentUser = null;
  let currentUserBuffer = "";
  const uniqueUsers = new Set();

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith("<")) {
      if (currentUser) {
        const wordCount = currentUserBuffer.split(/\s+/).filter(Boolean).length;
        userWordCount[currentUser] =
          (userWordCount[currentUser] || 0) + wordCount;
        currentUserBuffer = "";
      }

      const closingIndex = trimmedLine.indexOf(">");
      if (closingIndex !== -1) {
        currentUser = trimmedLine.slice(1, closingIndex);
        const message = trimmedLine.slice(closingIndex + 1).trim();
        currentUserBuffer += message;

        uniqueUsers.add(currentUser);
      }
    } else {
      if (currentUser) {
        currentUserBuffer += ` ${trimmedLine}`;
      }
    }
  }

  if (currentUser) {
    const wordCount = currentUserBuffer.split(/\s+/).filter(Boolean).length;
    userWordCount[currentUser] = (userWordCount[currentUser] || 0) + wordCount;
  }

  const sortedUsers = Object.entries(userWordCount).sort((a, b) => b[1] - a[1]);

  const numUniqueUsers = uniqueUsers.size;

  return sortedUsers.slice(0, numUniqueUsers);
}
