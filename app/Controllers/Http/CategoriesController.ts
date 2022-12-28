import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Category from 'App/Models/Category'

export default class CategoriesController {

  public async index({ request, response }: HttpContextContract) {

    const { page, per_page } = request.qs()

    const current_page = page ? page : 1
    const limit_per_page = per_page ? per_page : 100

    const categories = await Category.query().orderBy('id', 'desc').paginate(current_page, limit_per_page)

    return response.json({ categories })

  }

  public async store({ request, response }: HttpContextContract) {

    const { page, per_page } = request.qs()

    const current_page = page ? page : 1
    const limit_per_page = per_page ? per_page : 100

    const categoryValidation = schema.create({
      name: schema.string(),
      description: schema.string.optional()
    })

    const data = await request.validate({
      schema: categoryValidation,
      messages: { 'name.required': 'Campo nome é obrigatório!' }
    })

    await Category.create(data)

    const categories = await Category.query().orderBy('id', 'desc').paginate(current_page, limit_per_page)

    return response.json({ message: "Categoria cadastrada com sucesso!", categories })
  }

  public async show({ }: HttpContextContract) { }

  public async update({ request, params, response }: HttpContextContract) {

    const { page, per_page } = request.qs()

    const current_page = page ? page : 1
    const limit_per_page = per_page ? per_page : 100

    const category = await Category.find(params.id)

    if (!category) {
      return response.notFound({ error: "Categoria não existe" })
    }

    const categoryValidation = schema.create({
      name: schema.string(),
      description: schema.string.optional()
    })

    const data = await request.validate({
      schema: categoryValidation,
      messages: { 'name.required': 'Campo nome é obrigatório!' }
    })

    await category.merge(data).save()

    const categories = await Category.query()
      .orderBy('id', 'desc')
      .paginate(current_page, limit_per_page)


    return response.json({ error: "Categoria atualizada com sucesso!", categories })


  }

  public async destroy({ request, response, params }: HttpContextContract) {

    const { page, per_page } = request.qs()

    const current_page = page ? page : 1
    const limit_per_page = per_page ? per_page : 100

    const category = await Category.find(params.id)

    if (!category) {
      return response.notFound({ error: "Categoria não existe" })
    }

    await category.delete()

    const categories = await Category.query()
      .orderBy('id', 'desc')
      .paginate(current_page, limit_per_page)

    return response.json({ error: "Categoria deletada com sucesso!", categories })

  }
}
