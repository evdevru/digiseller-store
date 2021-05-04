'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductTagSchema extends Schema {
  up() {
    this.create('product_tag', (table) => {
      table.increments()
      table.integer('tag_id').unsigned()
      table.integer('product_id').unsigned()
      table.timestamps()

      table
        .foreign('tag_id')
        .references('id')
        .inTable('tags')
        .onDelete('cascade')
      table
        .foreign('product_id')
        .references('id')
        .inTable('products')
        .onDelete('cascade')
    })
  }

  down() {
    this.drop('product_tag')
  }
}

module.exports = ProductTagSchema
