const Router = require('express')
const lashController = require('../controller/lash.controller')
const authMiddleware = require('../middleware/authMiddleware')
const lash_router = new Router()

lash_router.post('/', lashController.create)
lash_router.post('/delete', lashController.delete)
lash_router.get('/', lashController.get)
lash_router.put('/', lashController.setting)
lash_router.get('/category', lashController.getCategories)
lash_router.post('/category', lashController.addCategory)
lash_router.post('/category/delete', lashController.deleteCategory)


module.exports = lash_router