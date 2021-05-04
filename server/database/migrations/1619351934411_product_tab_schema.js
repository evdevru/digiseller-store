'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductTabSchema extends Schema {
  up() {
    this.create('product_tab', (table) => {
      table.increments()
      table.integer('tab_id').unsigned()
      table.integer('product_id').unsigned()
      table.text('text').notNullable()
      table.timestamps()

      table
        .foreign('tab_id')
        .references('id')
        .inTable('tabs')
        .onDelete('cascade')
      table
        .foreign('product_id')
        .references('id')
        .inTable('products')
        .onDelete('cascade')
    })
  }

  down() {
    this.drop('product_tab')
  }
}

module.exports = ProductTabSchema
