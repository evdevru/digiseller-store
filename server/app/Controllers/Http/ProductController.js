"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Product = use("App/Models/Product");
const { validateAll } = use("Validator");
const Helpers = use("Helpers");
const slugify = require("slugify");
const { v4: uuidv4 } = require("uuid");
const imagemagick = require("imagemagick");

/**
 * Resourceful controller for interacting with products
 */
class ProductController {
  /**
   * Show a list of all products.
   * GET products
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {
    return await Product.query()
      .with("parameters")
      .with("tags")
      .with("tabs")
      .with("category")
      .fetch();
  }

  /**
   * Create/save a new product.
   * POST products
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const rules = {
      title: "required",
      slug: "required|unique:products,slug",
      digiseller_id: "required|integer",
      price: "required|number",
      price_official: "number",
      video: "accepted",
      category_id: "required|integer",
      parameters: "array",
      tags: "array",
      tabs: "array",
    };

    const data = request.only([
      "title",
      "digiseller_id",
      "price",
      "price_official",
      "video",
      "category_id",
      "description",
      "extra",
      "options",
    ]);
    data.slug = slugify(data.title).toLowerCase();
    data.options = JSON.stringify(data.options);

    const validation = await validateAll(data, rules);

    if (validation.fails()) {
      return response.status(400).send(validation.messages());
    }

    const thumbnail = request.file("thumbnail", {
      size: "3mb",
    })._files[0];
    const thumbnailName = `${uuidv4()}.${thumbnail.extname}`;

    const filePath = Helpers.resourcesPath(`uploads/goods`);
    const filePathFull = Helpers.resourcesPath(
      `uploads/goods/${thumbnailName}`
    );

    await thumbnail.move(filePath, {
      overwrite: true,
      name: thumbnailName,
    });
    if (!thumbnail.moved()) {
      return response.status(400).send({
        status: "error",
        message: thumbnail.error().message,
      });
    }
    try {
      /*await imagemagick.resize({
        srcPath: filePathFull,
        dstPath: filePathFull,
        width: 612,
      });*/
    } catch (e) {}
    data.thumbnail = thumbnailName;
    const images = request.file("images", { size: "10mb" });

    if (images) {
      data.images = [];
      const imagesPath = Helpers.resourcesPath(`uploads/images`);
      await images.moveAll(imagesPath, (file) => {
        const name = `${uuidv4()}.${file.extname}`;
        data.images.push(name);
        return {
          overwrite: true,
          name,
        };
      });

      if (!images.movedAll()) {
        return response.status(400).send({
          status: "error",
          message: images.errors(),
        });
      }

      data.images = JSON.stringify(data.images);
    }

    const product = await Product.create(data);

    const parameters = request.only(["parameters"]);
    const tags = request.only(["tags"]);
    const tabs = request.only(["tabs"]);
    if (parameters.parameters && parameters.parameters.length)
      await product.parameters().sync(parameters.parameters);
    if (tags.tags && tags.tags.length) await product.tags().sync(tags.tags);
    if (tabs.tabs && tabs.tabs.length) {
      tabs.tabs.forEach(async (tab) => {
        await product.tabs().attach(tab.id, (row) => {
          row.text = tab.text;
        });
      });
    }

    return response.status(200).send({
      status: "success",
      message: "Товар успешно создан",
      data: product,
    });
  }

  /**
   * Display a single product.
   * GET products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
    return await Product.query()
      .where("id", params.id)
      .orWhere("slug", params.id)
      .with("parameters.parent")
      .with("tags")
      .with("tabs")
      .with("category")
      .first();
  }

  /**
   * Update product details.
   * PUT or PATCH products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    const rules = {
      title: "required",
      slug: "required|unique:products,slug,id," + params.id,
      digiseller_id: "required|integer",
      price: "required|number",
      price_official: "number",
      video: "accepted",
      category_id: "required|integer",
      parameters: "array",
      tags: "array",
      tabs: "array",
    };

    const data = request.only([
      "title",
      "digiseller_id",
      "price",
      "price_official",
      "video",
      "category_id",
      "description",
      "extra",
      "options",
    ]);
    data.slug = slugify(data.title);

    data.options = JSON.stringify(data.options).toLowerCase();

    const validation = await validateAll(data, rules);

    if (validation.fails()) {
      return response.status(400).send(validation.messages());
    }

    const thumbnail = request.file("thumbnail", {
      size: "3mb",
    })._files[0];

    if (thumbnail) {
      const thumbnailName = `${uuidv4()}.${thumbnail.extname}`;

      const filePath = Helpers.resourcesPath(`uploads/goods`);
      const filePathFull = Helpers.resourcesPath(
        `uploads/goods/${thumbnailName}`
      );

      await thumbnail.move(filePath, {
        overwrite: true,
        name: thumbnailName,
      });
      if (!thumbnail.moved()) {
        return response.status(400).send({
          status: "error",
          message: thumbnail.error().message,
        });
      }
      try {
        /*await imagemagick.resize({
          srcPath: filePathFull,
          dstPath: filePathFull,
          width: 612,
        });*/
      } catch (e) {}
      data.thumbnail = thumbnailName;
    }

    const images = request.file("images", {
      size: "10mb",
    });

    if (images) {
      data.images = [];
      const filePath2 = Helpers.resourcesPath(`uploads/images`);
      await images.moveAll(filePath2, (file) => {
        const name = `${uuidv4()}.${file.extname}`;
        data.images.push(name);
        return {
          overwrite: true,
          name,
        };
      });

      if (!images.movedAll()) {
        return response.status(400).send({
          status: "error",
          message: images.errors(),
        });
      }

      data.images = JSON.stringify(data.images);
    }

    const product = await Product.find(params.id);

    product.merge(data);
    await product.save();

    const parameters = request.only(["parameters"]);
    const tags = request.only(["tags"]);
    const tabs = request.only(["tabs"]);
    await product.parameters().sync(parameters.parameters);
    await product.tags().sync(tags.tags);
    await product.tabs().detach();
    if (tabs.tabs && tabs.tabs.length) {
      tabs.tabs.forEach(async (tab) => {
        await product.tabs().attach(tab.id, (row) => {
          row.text = tab.text;
        });
      });
    }

    return response.status(200).send({
      status: "success",
      message: "Товар успешно изменен",
      data: product,
    });
  }

  /**
   * Delete a product with id.
   * DELETE products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
    const category = await Product.find(params.id);
    await category.delete();
    return response.json({
      status: "success",
      message: "Товар был удален!",
    });
  }

  async destroyAll({ request, response }) {
    await Product.query().delete();
    return response.json({
      status: "success",
      message: "Товары были удалены!",
    });
  }
}

module.exports = ProductController;
