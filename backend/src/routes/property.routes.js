import { Router } from "express";

const router = Router();
import { getProperties, getProperty }  from "../controllers/property.controller.js";


router.get('/', getProperties);
router.get('/:id', getProperty);

export default router;
