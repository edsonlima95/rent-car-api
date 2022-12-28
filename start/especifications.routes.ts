import Route from '@ioc:Adonis/Core/Route'


Route.resource('/especifications','EspecificationsController').middleware({'*': ['auth']}).apiOnly()