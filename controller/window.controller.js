const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Window, UserOrder } = require("../models/models");

const generateJwt = (id, name, email, role) => {
  return jwt.sign(
    { id: id, name: name, email: email, role: role },
    process.env.SECRET_KEY,
    { expiresIn: "24h" }
  );
};

class WindowController {
  async create(req, res, next) {
    const { time } = req.body;
    const temp_window = await Window.findOne({where: {
      time: time
    }})
    if (temp_window) return next(ApiError.badRequest("Окно с таким временем уже существует!"));
    const window = await Window.create({
      time,
    });
    const windows = await Window.findAll()
    if (!windows.length) return next(ApiError.badRequest("Видимо окошко не добавилось, или произошла ошибка"))
    return res.json({ message: `Окно для записи успешно добавлено`, windows });
  }

  async delete(req, res, next) {
    const { id } = req.body;
    const window = await Window.findOne({
      where: {
        id: id,
      },
    });
    if (!window) return next(ApiError.badRequest("Окна с таким временем не найдено!"));
    const time = window.time
    await window.destroy()
    const windows = await Window.findAll() ? await Window.findAll() : {}
    return res.json({
      message: `Окошко на ${time} успешно удалено`,
      windows
    });
  }

  async getAvailable(req, res, next) {
    const windows = await Window.findAll({
      where: {
        isPicked: false,
      },
    });
    return res.json({ windows });
  }

  async getAll(req, res, next) {
    const windows = await Window.findAll();
    return res.json({ windows });
  }

  async getMy(req, res, next) {
    const { id } = req.body
    const windows = await Window.findAll({where: {
      userId: id
    }})
    if (!windows) return next(ApiError.badRequest("Окон для записи не найдено!"));
    return res.json({windows})
  }

  async pick(req, res, next) {
    const { time, id, pick } = req.body;
    const window = await Window.findOne({ where: { time: time } })
    if (!window) {
      return next(ApiError.badRequest("Окна с таким временем не найдено!"));
    }
    const user = await User.findOne({where: {id: id}})
    if (!user) return next(ApiError.badRequest("Такого пользователя, кажись, не существует"))
    const user_windows = await Window.findAll({where: {userId: user.id}})
    const no_past_user_windows = user_windows.filter((window) => Date.parse(window.time) > Date.now() )
    if (no_past_user_windows.length >= 2 && pick) return next(ApiError.badRequest("У вас не может быть более 2-х активных записей"))
    const isID = pick ? user.id : null
    window.set({
      isPicked: pick,
      userId: isID
    });
    await window.save()
    const windows = await Window.findAll({where:{userId: user.id}}) ? await Window.findAll({where:{userId: user.id}}) : {}
    const available_windows = await Window.findAll({where: {isPicked: false}})
    if (!available_windows.length) return next(ApiError.badRequest("Доступных окон для записи не найдено"))
    const actual_time = new Date(time).toLocaleString().slice(0, 17)
    const all_windows = await Window.findAll()
    return res.json({
      message: `Запись на ${actual_time} успешно отменена`,
      windows,
      available_windows,
      all_windows
    });
  }

  // async check(req, res, next) {
  //   const token = generateJwt(
  //     req.user.id,
  //     req.user.name,
  //     req.user.email,
  //     req.user.role
  //   );
  //   return res.json({ token });
  // }
}

module.exports = new WindowController();
