"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Product extends Model {
  getImages(images) {
    const imgs = JSON.parse(images);
    if (!imgs || !imgs.length) return [];
    return imgs.map((name) => `${process.env.APP_URL}/images/${name}`);
  }

  getOptions(options) {
    if (options && options.length) return JSON.parse(options);
    else return [];
  }

  getThumbnail(thumbnail) {
    return process.env.APP_URL + "/goods/" + thumbnail;
  }

  parameters() {
    return this.belongsToMany("App/Models/Parameter");
  }

  tabs() {
    return this.belongsToMany("App/Models/Tab").withPivot(["text"]);
  }

  tags() {
    return this.belongsToMany("App/Models/Tag");
  }

  category() {
    return this.hasOne("App/Models/Category", "category_id", "id");
  }
}

module.exports = Product;
