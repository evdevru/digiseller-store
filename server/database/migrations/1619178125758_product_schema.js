"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ProductSchema extends Schema {
  up() {
    this.create("products", (table) => {
      table.increments();
      table.string("title", 100).notNullable();
      table.integer("digiseller_id").notNullable();
      table.integer("category_id").unsigned();
      table.string("slug", 100).notNullable().unique();
      table.float("price").defaultTo(1);
      table.float("price_official").nullable();
      table.text("description").collate("utf8mb4_unicode_ci");
      table.text("extra").collate("utf8mb4_unicode_ci");
      table.string("thumbnail", 100).notNullable();
      table.string("video");
      table.text("images");
      table.text("options");
      table.boolean("in_stock").defaultTo(true);

      table.timestamps();

      table.foreign("category_id").references("id").inTable("categories");
    });
  }

  down() {
    this.drop("products");
  }
}

module.exports = ProductSchema;
