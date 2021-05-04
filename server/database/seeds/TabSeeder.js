'use strict'

/*
|--------------------------------------------------------------------------
| TabSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class TabSeeder {
  async run() {
    await Factory.model('App/Models/Tab').createMany(6)
    console.log('Tabs seeded')
  }
}

module.exports = TabSeeder
