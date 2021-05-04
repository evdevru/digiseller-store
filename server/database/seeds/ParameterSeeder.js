'use strict'

/*
|--------------------------------------------------------------------------
| ParameterSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class ParameterSeeder {
  async run() {
    const parents = await Factory.model('App/Models/Parameter').createMany(3)

    await Promise.all(
      parents.map(async (parent) => {
        await Factory.model('App/Models/Parameter').createMany(3, {
          parent_id: parent.id,
        })
      })
    )
    console.log('Parameters seeded')
  }
}

module.exports = ParameterSeeder
