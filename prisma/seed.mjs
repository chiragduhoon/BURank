// Seeds the leaderboard with real LeetCode accounts so the app has live data.
// Run: node prisma/seed.mjs
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// yearStudying uses batch values ("24-28") — same format as the join form
// dropdown; the Batch column and Batch Wars grid key off these.
const SEED_USERS = [
  { username: "neal_wu", yearStudying: "22-26", enrollmentNo: "E22CSEU0001" },
  { username: "lee215", yearStudying: "23-27", enrollmentNo: "E23CSEU0042" },
  { username: "votrubac", yearStudying: "22-26", enrollmentNo: "E22CSEU0107" },
  { username: "awice", yearStudying: "24-28", enrollmentNo: "E24CSEU0210" },
  { username: "uwi", yearStudying: "23-27", enrollmentNo: "A23ARIU0315" },
  { username: "stefanpochmann", yearStudying: "22-26", enrollmentNo: "S22BASU0450" },
  { username: "larrys", yearStudying: "25-29", enrollmentNo: "E25CSEU0089" },
  { username: "cnkyrpsgl", yearStudying: "24-28", enrollmentNo: "E24CSEU0133" },
];

async function existsOnLeetCode(username) {
  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json", Referer: "https://leetcode.com" },
      body: JSON.stringify({
        query: `query ($username: String!) { matchedUser(username: $username) { username } }`,
        variables: { username },
      }),
    });
    const json = await res.json();
    return Boolean(json?.data?.matchedUser);
  } catch {
    return false;
  }
}

for (const user of SEED_USERS) {
  const valid = await existsOnLeetCode(user.username);
  if (!valid) {
    console.log(`skip  ${user.username} (not found on LeetCode)`);
    continue;
  }
  await prisma.member.upsert({
    where: { username: user.username },
    update: {
      yearStudying: user.yearStudying,
      enrollmentNo: user.enrollmentNo,
    },
    create: {
      username: user.username,
      email: `${user.username}@bennett.edu.in`,
      yearStudying: user.yearStudying,
      enrollmentNo: user.enrollmentNo,
    },
  });
  console.log(`added ${user.username}`);
}

const count = await prisma.member.count();
console.log(`\nTotal members: ${count}`);
await prisma.$disconnect();
