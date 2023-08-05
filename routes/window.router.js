const Router = require('express')
const windowController = require('../controller/window.controller')
const authMiddleware = require('../middleware/authMiddleware')
const window_router = new Router()

window_router.post('/add', windowController.create)
window_router.post('/delete', windowController.delete)
window_router.post('/pick', windowController.pick)
window_router.get('/get', windowController.getAvailable)
window_router.get('/all', windowController.getAll)
window_router.post('/my', windowController.getMy)

module.exports = window_router
