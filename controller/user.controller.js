const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/models");

const generateJwt = (id, name, email, tel, role) => {
  return jwt.sign(
    { id: id, name: name, email: email, tel: tel, role: role },
    process.env.SECRET_KEY,
    { expiresIn: "24000h" }
  );
};

class UserController {
  // async login(req, res, next) {
  //   const { email, password } = req.body;
  //   const user = await User.findOne({ where: { email } });
  //   if (!user) {
  //     // return next(ApiError.internal('Пользователь с таким email не найден!'))
  //     registration(req, res, next);
  //   }
  //   let comparePassword = bcrypt.compareSync(password, user.password);
  //   if (!comparePassword) {
  //     console.log("correct error");
  //     return next(ApiError.internal("Неверный пароль!"));
  //   }
  //   const token = generateJwt(user.id, user.name, user.email, user.role);
  //   return res.json({ token });
  // }

  async registration(req, res, next) {

    async function login(req, res, next) {
      const { email, tel, password } = req.body;
      const user = tel ? await User.findOne({ where: { tel: tel } }) : await User.findOne({ where: { email: email } })
      // if (!user) {
      //   // return next(ApiError.internal('Пользователь с таким email не найден!'))
      //   registration(req, res, next);
      // }
      let comparePassword = bcrypt.compareSync(password, user.password);
      if (!comparePassword) {
        return next(ApiError.badRequest("Неверный пароль!"));
      }
      const token = generateJwt(
        user.id, 
        user.name, 
        user.email, 
        user.tel, 
        user.role);
      return res.json({ token });
    }

    const { name, email, tel, password, role } = req.body;
    if ((!email && !tel) || !password) {
      return next(ApiError.badRequest("Некорректный email или пароль!"));
    }
    const candidate = tel ? await User.findOne({ where: { tel } }) : await User.findOne({ where: { email } });
    const candidate_email = email ? await User.findOne({where: {email: email}}) : {}
    if (candidate_email && email) return next(ApiError.badRequest('Пользователь с таким email уже существует!'))
    if (candidate) {
      // return next(ApiError.badRequest('Пользователь с таким email уже существует!'))
      return await login(req, res, next);
    }
    const hashPassword = await bcrypt.hash(password, 5);
    const user = await User.create({
      name: name,
      email: email,
      tel: tel,
      role: role,
      password: hashPassword,
    });
    const token = generateJwt(user.id, user.name, user.email, user.tel, user.role);

    return res.json({ token });
  }

  async getOne(req, res, next) {
    const { id } = req.body
    const user = await User.findOne({where: {
      id: id
    }})
    if (!user) return next(ApiError.badRequest("Пользователь не найден!"));
    return res.json({user})
  }

  async getAll(req, res, next) {
    const users = await User.findAll()
    return res.json({users})
  }

  async check(req, res, next) {
    const user = await User.findOne({where: {id: req.user.id}})
    if (!user) return next(ApiError.notFound("Пользователь не найден, ошибка авторизации"))
    const token = generateJwt(
      user.id,
      user.name,
      user.email,
      user.tel,
      user.role
    );
    return res.json({ token });
  }

  async setName(req, res, next) {
    const { name, id } = req.body
    const user = await User.findOne({where: {id: id}})
    if (!user) return next(ApiError.badRequest('Пользователь с таким ID не существует'))
    user.set({
      name: name
    })
    user.save()
    return res.json({user, message: 'Имя успешно изменено'})
  }

  async setEmail(req, res, next) {
    const { email, id } = req.body
    const user = await User.findOne({where: {id: id}})
    const user_email = await User.findOne({where: {email: email}})
    if (user_email) return next(ApiError.badRequest("Этот email уже занят"))
    if (!user) return next(ApiError.badRequest('Пользователь с таким ID не существует'))
    user.set({
      email: email
    })
    user.save()
    return res.json({user, message: 'Email успешно изменен'})
  }

}

module.exports = new UserController();
