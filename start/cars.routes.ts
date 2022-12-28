import Route from '@ioc:Adonis/Core/Route'


Route.post('/cars/images/:id','CarsController.images')

Route.resource('/cars', 'CarsController').middleware({'*': ['auth'],}).apiOnly()