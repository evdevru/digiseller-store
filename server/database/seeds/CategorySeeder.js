'use strict'

/*
|--------------------------------------------------------------------------
| CategorySeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class CategorySeeder {
  async run() {
    const parents = await Factory.model('App/Models/Category').createMany(3)

    await Promise.all(
      parents.map(async (parent) => {
        await Factory.model('App/Models/Category').createMany(3, {
          parent_id: parent.id,
        })
      })
    )
    console.log('Categories seeded')
  }
}

module.exports = CategorySeeder
