import Route from '@ioc:Adonis/Core/Route'



Route.post("/auth/login", "AuthController.login")

Route.get("/auth/logout", "AuthController.logout")

Route.get("/auth/check-token", "AuthController.checkToken")

