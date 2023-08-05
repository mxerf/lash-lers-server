const ApiError = require("../error/ApiError");
const { LashType, Category } = require("../models/models");

class LashController {

  async create(req, res, next) {
    const { value, price, bend, length, category } = req.body
    const candidate_lash = await LashType.findOne({where: {value: value}})
    if (candidate_lash) return next(ApiError.badRequest('Такие реснички у тебя уже есть, если что-то не так, напиши мне))))'))
    const candidate_category = await Category.findOne({where: {value: category}})
    if (!candidate_category) return next(ApiError.badRequest("Кажется, такая категория не нашлась"))
    const lash = await LashType.create({
      value,
      bend,
      length,
      price,
      categoryId: candidate_category.id
    })
    // await lash.save()
    const lashes = await LashType.findAll()
    if (!lashes) return next(ApiError.badRequest('Типов ресничек в базе данных не найдено, добавь что-нибудь или, если что-то поломалось, напиши мне'))
    return res.json({message: `Тип ${value} успешно добавлен в категорию ${category}`, lashes})
  }

  async get(req, res, next) {
    const lashes = await LashType.findAll()
    if (!lashes.length) return next(ApiError.badRequest('Типов ресничек в базе данных не найдено, добавь что-нибудь или, если что-то поломалось, напиши мне'))
    return res.json({lashes, message: 'Реснички успешно загружены'})
  }

  async setting(req, res, next) {
    const { value, price, id } = req.body
    const candidate_lash = await LashType.findOne({where: {id: id}})
    if (!candidate_lash) return next(ApiError.badRequest("Упс, таких ресничек нет"))
    candidate_lash.set({
      value: value,
      price: price,
    })
    await candidate_lash.save()
    const lashes = await LashType.findAll()
    if (!lashes.length) return next(ApiError.badRequest('Типов ресничек в базе данных не найдено, добавь что-нибудь или, если что-то поломалось, напиши мне'))
    return res.json({message: "Изменения внесены успешно", lashes})
  }

  async delete(req, res, next) {
    const { id } = req.body
    const lash = await LashType.findOne({where: {id: id}})
    if (!lash) return next(ApiError.badRequest("Волшебник, как ты пытаешься удалить то, чего уже и так нет?)"))
    const lashValue = lash.value
    await lash.destroy()
    const lashes = await LashType.findAll()
    if (!lashes.length) return next(ApiError.badRequest("Ресничек больше нет, грузиться нечему("))
    return res.json({message: `Реснички ${lashValue} успешно удалены`, lashes})
  }

  async getCategories(req, res, next) {
    const categories = await Category.findAll()
    if (!categories.length) return next(ApiError.badRequest("Категории не нашлись, нужно что-то добавить"))
    return res.json({message: "Категории успешно подгружены", categories})
  }

  async addCategory(req, res, next) {
    const { value } = req.body
    const candidate_category = await Category.findOne({where: {value: value}})
    if (candidate_category) return next(ApiError.badRequest("Такая категория уже существует"))
    const category = await Category.create({
      value: value
    })
    // await category.save()
    const categories = await Category.findAll()
    if (!categories) return next(ApiError.badRequest("Категории не нашлись, возможно что-то сломалось"))
    return res.json({message: `Категория "${value}" успешно добавлена`}, categories)
  }

  async deleteCategory(req, res, next) {
    
  }

}

module.exports = new LashController()