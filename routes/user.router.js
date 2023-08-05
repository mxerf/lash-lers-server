const Router = require('express')
const userController = require('../controller/user.controller')
const authMiddleware = require('../middleware/authMiddleware')
const user_router = new Router()

user_router.post('/auth', userController.registration)
user_router.get('/auth', authMiddleware, userController.check)
user_router.post('/get', userController.getOne)
user_router.get('/get', userController.getAll)
user_router.put('/settings/name', userController.setName)
user_router.put('/settings/email', userController.setEmail)

module.exports = user_router
