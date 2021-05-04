"use strict";

const User = use("App/Models/User");

class AuthController {
  async login({ auth, request, response }) {
    const password = request.input("password");
    const passwordConfirmation = process.env.ADMIN_PASSWORD || "admin";
    if (password === passwordConfirmation) {
      let user = await User.findBy("email", "admin@gmail.com");
      if (!user) {
        user = await User.findOrCreate({
          email: "admin@gmail.com",
          username: "admin",
          password: "admin",
        });
        await user.reload();
      }
      const token = await auth.generate(user);
      return response.status(200).send({
        status: "success",
        message: "Успешно авторизовались",
        data: token,
      });
    } else {
      return response.status(400).send({
        status: "error",
        message: "Не верный пароль! Проверьте переменную ADMIN_PASSWORD",
      });
    }
  }

  async profile({ auth, response }) {
    return response.status(200).send({
      data: { user: await auth.getUser() },
    });
  }
}

module.exports = AuthController;
