'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const slugify = require('slugify')

Factory.blueprint('App/Models/Tag', (faker) => {
  const title = faker.word({ syllables: 3 })
  return {
    title,
    slug: slugify(title),
  }
})

Factory.blueprint('App/Models/Tab', (faker) => {
  const title = faker.word({ syllables: 3 })
  return {
    title,
  }
})

Factory.blueprint(
  'App/Models/Category',
  (faker, i, data = { parent_id: null }) => {
    const title = faker.word({ syllables: 3 })
    return {
      title,
      slug: slugify(title),
      parent_id: data.parent_id,
    }
  }
)

Factory.blueprint(
  'App/Models/Parameter',
  (faker, i, data = { parent_id: null }) => {
    const title = faker.word({ syllables: 3 })
    return {
      title,
      slug: slugify(title),
      parent_id: data.parent_id,
    }
  }
)
