import { Router } from "express";
import ah from "express-async-handler";
import * as Controller from "./controller";

const router = Router();

router.post(
  "/sentiment",
  ah(async (req, res) => {
    const text = req.body.text;
    const sentiment = await Controller.getSentiment(text);
    res.send(sentiment);
  })
);

router.post(
  "/category",
  ah(async (req, res) => {
    const text = req.body.text;
    const category = await Controller.getCategory(text);
    res.send(category);
  })
);

export default router;
