import express from 'express'

import {authenticate} from '../utils/jwt.js'
import {getMyWishlist, toggleWishlist} from '../controllers/wishlistController.js'

const wishlistRouter = express.Router()

wishlistRouter.get('/fetch', authenticate, getMyWishlist)
wishlistRouter.post('/toggle', authenticate, toggleWishlist)

export default wishlistRouter