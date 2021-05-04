"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class TokensSchema extends Schema {
  up() {
    this.create("tokens", (table) => {
      table.increments();
      table.integer("user_id").unsigned();
      table.string("token", 100).notNullable().unique().index();
      table.string("type", 80).notNullable();
      table.boolean("is_revoked").defaultTo(false);
      table.timestamps();

      table
        .foreign("user_id")
        .references("id")
        .inTable("users")
        .onDelete("cascade");
    });
  }

  down() {
    this.drop("tokens");
  }
}

module.exports = TokensSchema;
