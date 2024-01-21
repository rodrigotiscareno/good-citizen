import { Router } from "express";
import ah from "express-async-handler";
import * as Controller from "./controller";

const router = Router();

router.post(
  "/fake",
  ah(async (req, res) => {
    const chat = await Controller.chatFakeResponseToNotGoBroke(3);
    res.send(chat);
  })
);

router.post(
  "/test",
  ah(async (req, res) => {
    const chat = await Controller.chatTest();
    res.send(chat);
  })
);

router.post(
  "/prompt",
  ah(async (req, res) => {
    const chat = await Controller.chatPrompt(
      req.body.messages,
      req.body.mood,
      req.body.answerLength
    );
    res.send(chat);
  })
);

router.post(
  "/ai/categorize",
  ah(async (req, res) => {
    const category = await Controller.getCategory(
      req.body.text,
      req.body.categories
    );
    res.send(category);
  })
);

export default router;
