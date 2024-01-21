import { ResultModel } from "./../../../../shared/results";
import dayjs from "dayjs";
import {
  VoiceModel,
  VoiceModelUI,
  VoiceMultipleChoiceOptionsModel,
  VoiceResultsModel,
} from "./../../../../shared/voice";

import axios from "axios";
import mysq1 from "mysql";
import mysql from "mysql2/promise";

const config = require("./../../config");
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const DEBUG = false;

export const addVoiceRow = async (row: any): Promise<any> => {
  const options = row.voice_mc.map((r) => {
    return {
      title: r,
    };
  });

  const category = "Arts & Living";
  const sentimentScore = 0.5;

  delete row.voice_mc;
  delete row.created_on;
  delete row.end_date;

  const keys = Object.keys(row);
  const values = Object.values(row);

  const keysSql = keys.map((k) => `${k}`).join(", ");
  const valuesSql = keys.map((k) => `?`);

  let sql = `INSERT INTO voice (${keysSql}, created_on, end_date) VALUES (${valuesSql}, ?, ?);`;

  const connection = await mysql.createConnection(config);
  const data = [
    ...values,
    new Date(),
    dayjs(new Date()).add(row.duration_days, "day").toDate(),
  ];

  const [rows] = await connection.execute(sql, data);
  const rows2 = rows as any;

  const voice_id = rows2.insertId;

  for (let i = 0; i < options.length; i++) {
    const [mc] = await connection.execute(
      "INSERT INTO voice_mc (title, voice_id) VALUES (?, ?)",
      [options[i].title, voice_id]
    );
  }

  const [metaAnalysis] = await connection.execute(
    "INSERT INTO meta_analysis (category, sentimentScore, voice_id) VALUES (?, ?, ?)",
    [category, sentimentScore, voice_id]
  );

  return Promise.resolve(JSON.stringify({ result: "success" }));
};

// Used Prisma first but converted it to MySQL above for this course.
export const addVoiceRowPrisma = async (row: any): Promise<any> => {
  const options = row.voice_mc.map((r) => {
    return {
      title: r,
    };
  });

  console.log(options);

  try {
    const category = await Classify.getCategory(
      `${row.question} ${row.description}`
    );
    const sentimentScore = await Classify.getSentiment(
      `${row.question} ${row.description}`
    );

    const voice = await prisma.voice.create({
      data: {
        ...row,
        created_on: new Date(),
        end_date: dayjs(new Date()).add(row.duration_days, "day").toDate(),
        voice_mc: {
          create: options,
        },
        meta_analysis: {
          create: {
            category,
            sentimentScore,
          },
        },
      },
      include: {
        voice_mc: true,
      },
    });

    return Promise.resolve(voice);
  } catch (e) {
    console.log(e);
    return Promise.reject("Error adding voice row");
  }
};

export const addVoiceResultRow = async (
  voiceId: string,
  row: VoiceResultsModel
): Promise<any> => {
  if (isNaN(Number(voiceId))) {
    return Promise.reject("Invalid Voice ID");
  }

  let connection = mysq1.createConnection(config);

  let rw = { ...row };
  rw.created_on = new Date();
  rw.voice_id = Number(voiceId);

  let fields = Object.keys(rw);
  let data = Object.values(rw);

  let sql = `INSERT INTO voice_results (${fields.join(",")}) VALUES (${"?,"
    .repeat(data.length)
    .slice(0, -1)})`;

  if (DEBUG) {
    console.log(sql);
    console.log(data);
  }

  return new Promise((resolve, reject) => {
    connection.query(sql, data, (error, results, fields) => {
      if (error) {
        console.error(error.message);
        reject(error.message);
      }

      let resultsString = results;
      connection.end();
      resolve({
        results: resultsString,
      });
    });
  });
};

export const getVoiceQuestionsByUser = async (userId: string): Promise<any> => {
  const voice = await prisma.voice.findMany({
    include: {
      voice_mc: true,
      meta_analysis: true,
      comments: {
        include: {
          user: true,
        },
      },
    },
    where: {
      status: "active",
    },
  });

  return Promise.resolve(voice);
};

export const getVoiceQuestionsByNeighboorhood = async (
  neighboorhoodId: string
): Promise<any> => {
  if (isNaN(Number(neighboorhoodId))) {
    return Promise.reject("Invalid Neighboorhood Id ID");
  }
  try {
    const voice = await prisma.voice.findMany({
      include: {
        voice_mc: true,
        voice_results: true,
        user: {
          select: {
            user_id: true,
            first_name: true,
            last_name: true,
            profile_picture_link: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                user_id: true,
                first_name: true,
                last_name: true,
                profile_picture_link: true,
              },
            },
          },
        },
        meta_analysis: true,
      },
      where: {
        status: "active",
      },
    } as any);

    return Promise.resolve({
      results: voice,
    });
  } catch (e) {
    console.log(e);
  }
};
export const getElectedMembersByPostalCode = async (
  postalCode: string
): Promise<any> => {
  // https://represent.opennorth.ca/postcodes/L8E0E8/
  const electedMembers = await axios.post(
    `https://represent.opennorth.ca/postcodes/${postalCode}`
  );
  return Promise.resolve(electedMembers.data);
};
