"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class TabSchema extends Schema {
  up() {
    this.create("tabs", (table) => {
      table.increments();
      table.string("title", 100).notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("tabs");
  }
}

module.exports = TabSchema;
