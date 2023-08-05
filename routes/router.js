const Router = require('express')
const lash_router = require('./lash.router')
const router = new Router()
const user_router = require('./user.router')
const window_router = require('./window.router')


router.use('/user', user_router)
router.use('/windows', window_router)
router.use('/lashes', lash_router)


module.exports = router