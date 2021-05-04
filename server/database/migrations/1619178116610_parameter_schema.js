"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ParameterSchema extends Schema {
  up() {
    this.create("parameters", (table) => {
      table.increments();
      table.string("title", 100).notNullable();
      table.string("slug", 100).notNullable().unique();
      table.integer("parent_id").unsigned();
      table.boolean("visible").defaultTo(true);
      table.timestamps();

      table
        .foreign("parent_id")
        .references("id")
        .inTable("parameters")
        .onDelete("cascade");
    });
  }

  down() {
    this.drop("parameters");
  }
}

module.exports = ParameterSchema;
