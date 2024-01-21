import { Router } from "express";

import Feed from "./feed/routes";
import Voice from "./voice/routes";
import Chat from "./chat/routes";
import Classify from "./classify/routes";
import Comment from "./comments/routes";

const router = Router();

router.use("/comment", Comment);
router.use("/feed", Feed);
router.use("/voice", Voice);
router.use("/chat", Chat);
router.use("/classify", Classify);

export default router;
