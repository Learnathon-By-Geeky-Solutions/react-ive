import express from 'express';
import { sendOfferLetter } from '../controllers/offer.controller.js';
const offerRouter = express.Router();

offerRouter.post("/sendOffer", sendOfferLetter);

export default offerRouter;