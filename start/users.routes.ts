import Route from '@ioc:Adonis/Core/Route'

Route.get('/users/image/:image','UsersController.image')

Route.patch('/users/avatar/:id','UsersController.avatar').middleware(['auth'])

Route.resource("/users", "UsersController").middleware({
    update: ['auth'],
    destroy: ['auth'],
}).apiOnly()
