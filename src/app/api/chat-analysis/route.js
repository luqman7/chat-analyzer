// import multer from "multer";
// import fs from "fs";

import { NextResponse } from "next/server";

// // Set up multer storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "/tmp"); // Save files to a temporary directory
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname); // Keep the original file name
//   },
// });

// const upload = multer({ storage });

// const processChatLogs = (files) => {
//   let userWordCount = {};

//   for (const file of files) {
//     const filePath = file.path;
//     const content = fs.readFileSync(filePath, "utf8");

//     // Split the content into lines
//     const lines = content.split("\n");

//     let currentUser = null;
//     let currentWords = "";

//     for (const line of lines) {
//       if (line.startsWith("<")) {
//         const endOfUsername = line.indexOf(">");
//         if (endOfUsername !== -1) {
//           currentUser = line.slice(1, endOfUsername);
//           currentWords = line.slice(endOfUsername + 1).trim();
//         }
//       } else {
//         // Continue with the same user
//         currentWords += ` ${line.trim()}`;
//       }

//       if (currentUser) {
//         const words = currentWords.split(/\s+/);
//         if (!userWordCount[currentUser]) {
//           userWordCount[currentUser] = 0;
//         }
//         userWordCount[currentUser] += words.length;
//         currentWords = "";
//       }
//     }
//   }

//   // Convert userWordCount to an array of { user, words } objects
//   const userWordCountArray = Object.entries(userWordCount).map(
//     ([user, words]) => ({
//       user,
//       words,
//     })
//   );

//   // Sort the array based on word count and return the top k chattiest users
//   userWordCountArray.sort((a, b) => b.words - a.words);

//   return userWordCountArray;
// };

// export default async function handler(req, res) {
//   console.log("req", req);
//   if (req.method === "POST") {
//     try {
//       // Use multer to handle file uploads
//       upload.array("files")(req, res, async function (err) {
//         if (err) {
//           return res.status(500).json({ error: "File upload error." });
//         }

//         // Process the chat logs
//         const files = req.files;
//         const topUsers = processChatLogs(files);

//         // Send the results to the frontend
//         res.status(200).json(topUsers);
//       });
//     } catch (error) {
//       console.error(error);
//       res
//         .status(500)
//         .json({ error: "An error occurred while processing the chat logs." });
//     }
//   } else {
//     res.status(406).json({ error: "Method not allowed." });
//   }
// }

export async function POST(req, res) {
  console.log("ehehehe", req);
  return NextResponse.json({ characters: "characters.data" });
}
