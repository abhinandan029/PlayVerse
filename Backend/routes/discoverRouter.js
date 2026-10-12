import express from "express"

import { search, getGame, mostPlayed, trending, allGames, newReleases, topRated } from "../controllers/discoverController.js"

const discoverRouter = express.Router()

discoverRouter.get('/search', search)
discoverRouter.get('/most-played', mostPlayed)
discoverRouter.get('/trending', trending)
discoverRouter.get('/all', allGames)
discoverRouter.get('/new-releases', newReleases)
discoverRouter.get('/top-rated', topRated)
discoverRouter.get('/:igdbId', getGame)

export default discoverRouter