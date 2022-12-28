import Route from '@ioc:Adonis/Core/Route'


Route.put('/rents/:id/:car','RentsController.update')
Route.resource('/rents','RentsController').apiOnly()