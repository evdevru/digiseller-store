'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Tab = use('App/Models/Tab')
const { validateAll } = use('Validator')

/**
 * Resourceful controller for interacting with categories
 */
class TabController {
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
    return await Tab.all()
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
      title: 'required',
    }

    const validation = await validateAll(request.all(), rules)

    if (validation.fails()) {
      return response.status(400).send(validation.messages())
    }

    const data = request.only(['title'])

    const tag = await Tab.create(data)

    return response.status(204).send({
      status: 'success',
      message: 'Вкладка успешно создана',
      data: tag,
    })
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
    return await Tab.find(params.id)
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
      title: 'required',
    }

    const validation = await validateAll(request.all(), rules)

    if (validation.fails()) {
      return response.status(400).send(validation.messages())
    }

    const data = request.only(['title', 'parent_id'])

    const tag = await Tab.find(params.id)
    tag.merge(data)
    await tag.save()

    return response.status(200).send({
      status: 'success',
      message: 'Вкладка успешно изменена',
      data: tag,
    })
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
    const tag = await Tab.find(params.id)
    await tag.delete()
    return response.json({
      status: 'success',
      message: 'Вкладка была удалена!',
    })
  }
}

module.exports = TabController
