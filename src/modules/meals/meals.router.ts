import express, { Request, Response } from 'express';
import { postController } from './meals.controller';

const router = express.Router();

router.post("/meals", postController.createPost);

export const mealRoute = router;
