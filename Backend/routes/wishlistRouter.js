import express from 'express'

import {authenticate} from '../utils/jwt.js'
import {getMyWishlist, getMyDiscoverWishlist, toggleWishlist} from '../controllers/wishlistController.js'

const wishlistRouter = express.Router()

wishlistRouter.get('/fetch', authenticate, getMyWishlist)
wishlistRouter.get('/discover-games', authenticate, getMyDiscoverWishlist)
wishlistRouter.post('/toggle', authenticate, toggleWishlist)

export default wishlistRouter