import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getPosts = async (): Promise<any> => {
  const voice = await prisma.voice.findMany({
    include: {
      voice_mc: true,
    },
  } as any);

  return voice;
};
