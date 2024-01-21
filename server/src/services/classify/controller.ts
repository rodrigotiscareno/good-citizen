import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getSentiment = async (text: string): Promise<any> => {
  const language = require("@google-cloud/language");

  const client = new language.LanguageServiceClient({
    projectId: "good-citizen-msci-project",
  });

  const document = {
    content: text,
    type: "PLAIN_TEXT",
  };

  const [result] = await client.analyzeSentiment({ document: document });
  const sentiment = result.documentSentiment;

  return Promise.resolve(sentiment.score);
};

export const getCategory = async (text: string): Promise<any> => {
  const categories = [
    "Arts & Entertainment",
    "Business & Industrial",
    "Computers & Electronics",
    "Finance & Law",
    "Food & Drink",
    "Games",
    "Health",
    "Hobbies & Leisure",
    "Home & Garden",
  ];

  return Promise.resolve("Arts & Entertainment");
};
