"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Parameter = use("App/Models/Parameter");
const { validateAll } = use("Validator");
const slugify = require("slugify");

/**
 * Resourceful controller for interacting with categories
 */
class ParameterController {
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
    return await Parameter.all();
  }

  /**
   * Create/save a new parameter.
   * POST categories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const data = request.only(["title", "parent_id", "visible"]);
    data.slug = slugify(data.title).toLowerCase();

    const rules = {
      title: "required",
      slug: "unique:parameters,slug",
    };

    const validation = await validateAll(data, rules);

    if (validation.fails()) {
      return response.status(400).send(validation.messages());
    }

    const parameter = await Parameter.create(data);

    return response.status(201).send({
      status: "success",
      message: "Параметр успешно создан",
      data: parameter,
    });
  }

  /**
   * Display a single parameter.
   * GET categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
    return await Parameter.find(params.id);
  }

  /**
   * Update parameter details.
   * PUT or PATCH categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    const rules = {
      title: "required",
      slug: "unique:parameters,slug,id," + params.id,
    };

    const data = request.only(["title", "parent_id", "visible"]);
    data.slug = slugify(data.title).toLowerCase();

    const validation = await validateAll(data, rules);

    if (validation.fails()) {
      return response.status(400).send(validation.messages());
    }

    const parameter = await Parameter.find(params.id);
    parameter.merge(data);
    await parameter.save();

    return response.status(200).send({
      status: "success",
      message: "Параметр успешно изменен",
      data: parameter,
    });
  }

  /**
   * Delete a parameter with id.
   * DELETE categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
    const parameter = await Parameter.find(params.id);
    await parameter.delete();
    return response.json({
      status: "success",
      message: "Параметр был удален!",
    });
  }
}

module.exports = ParameterController;
