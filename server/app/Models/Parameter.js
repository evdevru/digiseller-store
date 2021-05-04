"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Parameter extends Model {
  parent() {
    return this.hasOne("App/Models/Parameter", "parent_id", "id");
  }

  getVisible(visible) {
    return Boolean(visible);
  }
}

module.exports = Parameter;
