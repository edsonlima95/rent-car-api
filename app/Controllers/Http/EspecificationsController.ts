import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Especification from 'App/Models/Especification'

export default class EspecificationsController {
  public async index({ request, response }: HttpContextContract) {

    const { page, per_page } = request.qs()

    const current_page = page ? page : 1
    const limit_per_page = per_page ? per_page : 100

    const especifications = await Especification.query().orderBy('id', 'desc').paginate(current_page, limit_per_page)

    return response.json({ especifications })

  }

  public async store({ request, response }: HttpContextContract) {

    const { page, per_page } = request.qs()

    const current_page = page ? page : 1
    const limit_per_page = per_page ? per_page : 100

    const especificationValidation = schema.create({
      name: schema.string(),
      description: schema.string.optional()
    })

    const data = await request.validate({
      schema: especificationValidation,
      messages: { 'name.required': 'Campo nome é obrigatório!' }
    })

    await Especification.create(data)

    const especifications = await Especification.query()
      .orderBy('id', 'desc')
      .paginate(current_page, limit_per_page)

    return response.json({ message: "Especificação cadastrada com sucesso!", especifications })
  }

  public async show({ }: HttpContextContract) { }

  public async update({ request, params, response }: HttpContextContract) {

    const { page, per_page } = request.qs()

    const current_page = page ? page : 1
    const limit_per_page = per_page ? per_page : 100

    const especification = await Especification.find(params.id)

    if (!especification) {
      return response.notFound({ error: "Especificação não existe" })
    }

    const especificationValidation = schema.create({
      name: schema.string(),
      description: schema.string.optional()
    })

    const data = await request.validate({
      schema: especificationValidation,
      messages: { 'name.required': 'Campo nome é obrigatório!' }
    })

    await especification.merge(data).save()

    const especifications = await Especification.query()
      .orderBy('id', 'desc')
      .paginate(current_page, limit_per_page)


    return response.json({ error: "Especificação atualizada com sucesso!", especifications })


  }

  public async destroy({ request, response, params }: HttpContextContract) {

    const { page, per_page } = request.qs()

    const current_page = page ? page : 1
    const limit_per_page = per_page ? per_page : 100

    const especification = await Especification.find(params.id)

    if (!especification) {
      return response.notFound({ error: "Especificação não existe" })
    }

    await especification.delete()

    const especifications = await Especification.query()
      .orderBy('id', 'desc')
      .paginate(current_page, limit_per_page)

    return response.json({ error: "Especificação deletada com sucesso!", especifications })

  }
}
