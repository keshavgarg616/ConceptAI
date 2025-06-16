import { Router } from "express";
import verifyToken from "../middleware.js";
import {
	getConceptHistory,
	getLanguages,
	updateConceptHistory,
	updateLanguages,
} from "../controllers/languagesController.js";
const languagesRouter = Router();

languagesRouter.post("/update-language", verifyToken, updateLanguages);
languagesRouter.post("/get-languages", verifyToken, getLanguages);
languagesRouter.post("/update-history", verifyToken, updateConceptHistory);
languagesRouter.post("/get-history", verifyToken, getConceptHistory);

export default languagesRouter;
