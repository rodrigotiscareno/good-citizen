import dayjs from "dayjs";
import { PrismaClient } from "@prisma/client";
import { NewCommentUIModel } from "../../../../shared/comments";
const prisma = new PrismaClient();

import mysql from "mysql2/promise";
const config = require("./../../config");

export const getComments = async (
  contentType,
  contentId: string
): Promise<any> => {
  if (isNaN(Number(contentId))) {
    return Promise.reject("Invalid id");
  }

  let where = "";
  switch (contentType) {
    case "feed":
      where = `feed_id = ?`;
      break;
    case "voice":
      where = `voice_id = ?`;
      break;
    case "event":
      where = `event_id = ?`;
      break;
    default:
      break;
  }

  const connection = await mysql.createConnection(config);

  const [rows] = await connection.execute(
    `SELECT * FROM comments WHERE ${where} ORDER BY created_on DESC;`,
    [Number(contentId)]
  );

  return rows;
};

export const getCommentsPrisma = async (
  contentType,
  contentId: string
): Promise<any> => {
  if (isNaN(Number(contentId))) {
    return Promise.reject("Invalid id");
  }

  let where = {};
  switch (contentType) {
    case "feed":
      where = {
        feed_id: Number(contentId),
      };
      break;
    case "voice":
      where = {
        voice_id: Number(contentId),
      };
      break;
    case "event":
      where = {
        event_id: Number(contentId),
      };
      break;
    default:
      break;
  }

  const comments = await prisma.comments.findMany({
    where,
  });

  return comments;
};

export const saveComment = async (row: any): Promise<any> => {
  delete row.created_on;

  const keys = Object.keys(row);
  const values = Object.values(row);

  const keysSql = keys.map((k) => `${k}`).join(", ");
  const valuesSql = keys.map((k) => `?`);

  let sql = `INSERT INTO comments (${keysSql}, created_on) VALUES (${valuesSql}, ?);`;

  const connection = await mysql.createConnection(config);
  const data = [...values, new Date()];

  const [rows] = await connection.execute(sql, data);

  return Promise.resolve("Success");
};

export const saveCommentPrisma = async (
  row: NewCommentUIModel
): Promise<any> => {
  const comment = await prisma.comments.create({
    data: {
      ...row,
      created_on: new Date(),
    },
  });

  return Promise.resolve(comment);
};
