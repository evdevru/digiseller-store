"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Tag = use("App/Models/Tag");
const { validateAll } = use("Validator");
const slugify = require("slugify");

/**
 * Resourceful controller for interacting with categories
 */
class TagController {
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
    return await Tag.all();
  }

  /**
   * Create/save a new tag.
   * POST categories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const rules = {
      title: "required",
    };

    const validation = await validateAll(request.all(), rules);

    if (validation.fails()) {
      return response.status(400).send(validation.messages());
    }

    const data = request.only(["title", "parent_id"]);
    data.slug = slugify(data.title).toLowerCase();

    const tag = await Tag.create(data);

    return response.status(204).send({
      status: "success",
      message: "Тэг успешно создан",
      data: tag,
    });
  }

  /**
   * Display a single tag.
   * GET categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
    return await Tag.find(params.id);
  }

  /**
   * Update tag details.
   * PUT or PATCH categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    const rules = {
      title: "required",
    };

    const validation = await validateAll(request.all(), rules);

    if (validation.fails()) {
      return response.status(400).send(validation.messages());
    }

    const data = request.only(["title", "parent_id"]);
    data.slug = slugify(data.title).toLowerCase();

    const tag = await Tag.find(params.id);
    tag.merge(data);
    await tag.save();

    return response.status(200).send({
      status: "success",
      message: "Тэг успешно изменен",
      data: tag,
    });
  }

  /**
   * Delete a tag with id.
   * DELETE categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
    const tag = await Tag.find(params.id);
    await tag.delete();
    return response.json({
      status: "success",
      message: "Тэг был удален!",
    });
  }
}

module.exports = TagController;
