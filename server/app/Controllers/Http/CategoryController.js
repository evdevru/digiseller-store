"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Category = use("App/Models/Category");
const { validateAll } = use("Validator");
const slugify = require("slugify");

/**
 * Resourceful controller for interacting with categories
 */
class CategoryController {
  /**
   * Show a list of all categories.
   * GET categories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {
    return await Category.all();
  }

  /**
   * Create/save a new category.
   * POST categories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const rules = {
      title: "required",
      slug: "unique:categories,slug",
    };

    const data = request.only(["title", "parent_id", "digiseller_id"]);
    data.slug = slugify(data.title).toLowerCase();

    const validation = await validateAll(request.all(), rules);

    if (validation.fails()) {
      return response.status(400).send(validation.messages());
    }

    if (data.parent_id) {
      const parent = await Category.find(data.parent_id);
      data.slug = parent.toJSON().slug + "-" + slugify(data.title);
    }

    const category = await Category.create(data);

    return response.status(201).send({
      status: "success",
      message: "Категория успешно создана",
      data: category,
    });
  }

  /**
   * Display a single category.
   * GET categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
    return await Category.find(params.id);
  }

  /**
   * Update category details.
   * PUT or PATCH categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    const rules = {
      title: "required",
      slug: "unique:categories,slug,id," + params.id,
    };

    const data = request.only(["title", "parent_id", "digiseller_id"]);
    data.slug = slugify(data.title).toLowerCase();

    const validation = await validateAll(data, rules);

    if (validation.fails()) {
      return response.status(400).send(validation.messages());
    }

    if (data.parent_id) {
      const parent = await Category.find(data.parent_id);
      data.slug = parent.toJSON().slug + "-" + slugify(data.title);
    }

    const category = await Category.find(params.id);
    category.merge(data);
    await category.save();

    return response.status(200).send({
      status: "success",
      message: "Категория успешно изменена",
      data: category,
    });
  }

  /**
   * Delete a category with id.
   * DELETE categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
    try {
      const category = await Category.find(params.id);
      await category.delete();
      return response.json({
        status: "success",
        message: "Категория была удалена!",
      });
    } catch (e) {
      return response.json({
        status: "error",
        message: "Категория имеет связанные товары!",
      });
    }
  }

  /**
   * Delete all categories.
   * DELETE categories
   *
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroyAll({ request, response }) {
    await Category.query().delete();
    return response.json({
      status: "success",
      message: "Категории были удалены!",
    });
  }
}

module.exports = CategoryController;
