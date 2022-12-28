import Route from '@ioc:Adonis/Core/Route'


Route.resource('/categories','CategoriesController').middleware({'*': ['auth']}).apiOnly()

