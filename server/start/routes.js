'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Helpers = use('Helpers')

Route.group(() => {
  Route.post('auth/login', 'AuthController.login')
  Route.get('auth/profile', 'AuthController.profile')

  Route.get('categories', 'CategoryController.index')
  Route.get('tags', 'TagController.index')
  Route.get('tabs', 'TabController.index')
  Route.get('parameters', 'ParameterController.index')
  Route.get('products', 'ProductController.index')
  Route.get('products/:id', 'ProductController.show')
}).prefix('api/')

Route.group(() => {
  Route.resource('categories', 'CategoryController')
  Route.delete('categories', 'CategoryController.destroyAll')
  Route.delete('products', 'ProductController.destroyAll')
  Route.resource('tags', 'TagController')
  Route.resource('tabs', 'TabController')
  Route.resource('parameters', 'ParameterController')
  Route.resource('products', 'ProductController')
  Route.get('fetch', function ({ request, response }) {
    const fileUrl = request.get('file').file
    return response.download(Helpers.publicPath(fileUrl))
  })
})
  .prefix('api/')
  .middleware('auth')
