"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class CategorySchema extends Schema {
  up() {
    this.create("categories", (table) => {
      table.increments();
      table.string("title", 100).notNullable();
      table.string("slug", 100).notNullable().unique();
      table.string("digiseller_id", 100).nullable();
      table.integer("parent_id").unsigned();
      table.timestamps();

      table
        .foreign("parent_id")
        .references("id")
        .inTable("categories")
        .onDelete("cascade");
    });
  }

  down() {
    this.drop("categories");
  }
}

module.exports = CategorySchema;
