'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductParameterSchema extends Schema {
  up() {
    this.create('parameter_product', (table) => {
      table.increments()
      table.integer('parameter_id').unsigned()
      table.integer('product_id').unsigned()
      table.timestamps()

      table
        .foreign('parameter_id')
        .references('id')
        .inTable('parameters')
        .onDelete('cascade')
      table
        .foreign('product_id')
        .references('id')
        .inTable('products')
        .onDelete('cascade')
    })
  }

  down() {
    this.drop('parameter_product')
  }
}

module.exports = ProductParameterSchema
