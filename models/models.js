const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, defaultValue: "Unknown" },
  email: { type: DataTypes.STRING, unique: false, allowNull: true, defaultValue: "" },
  tel: { type: DataTypes.STRING, unique: true, defaultValue: "" },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: "USER" },
});

// const UserOrder = sequelize.define("user_order", {
//   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//   userId: { type: DataTypes.INTEGER, autoIncrement: false },
//   time: {type: DataTypes.DATE, unique: true},
//   windowId: { type: DataTypes.INTEGER, autoIncrement: false },
// });

const Window = sequelize.define("window", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  time: { type: DataTypes.DATE, unique: true },
  isPicked: { type: DataTypes.BOOLEAN, defaultValue: false },
});

const Category = sequelize.define("category", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  value: { type: DataTypes.STRING, unique: true, allowNull: false },
});

const LashType = sequelize.define("lash_type", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  value: { type: DataTypes.STRING, unique: true, allowNull: false },
  bend: { type: DataTypes.STRING, unique: false, defaultValue: "" },
  length: { type: DataTypes.STRING, unique: false, defaultValue: "" },
  price: { type: DataTypes.INTEGER, unique: false },
});

User.hasMany(Window);
Window.belongsTo(User);

Category.hasMany(LashType)
LashType.belongsTo(Category)

module.exports = {
  User,
  Window,
  LashType,
  Category
};
