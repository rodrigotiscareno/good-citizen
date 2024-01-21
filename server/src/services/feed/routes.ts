import { Router } from "express";
import ah from "express-async-handler";
import * as Controller from "./controller";

const router = Router();

router.get(
  "/feed",
  ah(async (req, res) => {
    console.log("ABC");
    const posts = await Controller.getPosts();
    res.send(posts);
  })
);

export default router;
