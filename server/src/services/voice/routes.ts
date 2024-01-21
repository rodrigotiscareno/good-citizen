import { Router } from "express";
import ah from "express-async-handler";
import * as Controller from "./controller";

const router = Router();

router.get(
  "/byneighboorhood/:neighboorhoodId/user/:userId",
  ah(async (req, res) => {
    const voice = await Controller.getVoiceQuestionsByNeighboorhood(
      req.params.neighboorhoodId
    ).catch((err) => {
      res.status(500).send(err);
    });

    res.send(voice);
  })
);

router.get(
  "/byuser/:userId",
  ah(async (req, res) => {
    const voice = await Controller.getVoiceQuestionsByUser(
      req.params.userId
    ).catch((err) => {
      res.status(500).send(err);
    });

    res.send(voice);
  })
);

router.post(
  "/add",
  ah(async (req, res) => {
    const voice = await Controller.addVoiceRow(req.body).catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
    res.send(voice);
  })
);

router.post(
  "/:voiceId/result/add",
  ah(async (req, res) => {
    const voice = await Controller.addVoiceResultRow(
      req.params.voiceId,
      req.body
    ).catch((err) => {
      res.status(500).send(err);
    });
    res.send(voice);
  })
);

router.get(
  "/electedmembers/:postalcode",
  ah(async (req, res) => {
    const members = await Controller.getElectedMembersByPostalCode(
      req.params.postalcode
    );

    res.send(members);

    // res.sendFile("electedMembersPostalCode.json", {
    //   root: __dirname + "/../../services/voice/",
    // });
  })
);

export default router;
