import { CommentsParentType } from "./../../../../shared/comments";
import { Router } from "express";
import ah from "express-async-handler";
import * as Controller from "./controller";

const router = Router();

router.get(
  "/content/:contentType/:contentId",
  ah(async (req, res) => {
    const validContentTypes = ["feed", "voice", "event"];
    if (!validContentTypes.includes(req.params.contentType)) {
      res.status(400).send("Invalid content type");
    }

    const posts = await Controller.getComments("feed", req.params.contentId);
    res.send(posts);
  })
);

router.post(
  "/add",
  ah(async (req, res) => {
    const posts = await Controller.saveComment(req.body);
    res.send(posts);
  })
);

export default router;
