"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class TagSchema extends Schema {
  up() {
    this.create("tags", (table) => {
      table.increments();
      table.string("title", 100).notNullable();
      table.string("slug", 100).notNullable().unique();
      table.timestamps();
    });
  }

  down() {
    this.drop("tags");
  }
}

module.exports = TagSchema;
