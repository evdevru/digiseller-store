'use strict'

/*
|--------------------------------------------------------------------------
| TagSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class TagSeeder {
  async run() {
    await Factory.model('App/Models/Tag').createMany(6)
    console.log('Tags seeded')
  }
}

module.exports = TagSeeder
