import express from "express"

import { search, getGame, trending } from "../controllers/discoverController.js"

const discoverRouter = express.Router()

discoverRouter.get('/search', search)
discoverRouter.get('/trending', trending)
discoverRouter.get('/:igdbId', getGame)

export default discoverRouter