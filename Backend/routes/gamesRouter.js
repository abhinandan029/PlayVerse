import express from 'express'

import {loadGames} from '../controllers/gamesController.js'

const gamesRouter = express.Router()

gamesRouter.get('/fetch-games', loadGames)

export default gamesRouter