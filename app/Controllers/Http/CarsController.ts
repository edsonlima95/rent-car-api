import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Car from 'App/Models/Car'
import CarValidator from 'App/Validators/CarValidator'

export default class CarsController {

  public async index({ request, response }: HttpContextContract) {


    const { page, per_page } = request.qs()

    const current_page = page ? page : 1
    const limit_per_page = per_page ? per_page : 100

    const cars = await Car.query()
      .orderBy('id', 'desc')
      .preload('especifications')
      .preload('carImages')
      .paginate(current_page, limit_per_page)

    return response.json({ cars })

  }

  public async store({ request, response }: HttpContextContract) {

    const { page, per_page } = request.qs()

    const current_page = page ? page : 1
    const limit_per_page = per_page ? per_page : 100

    const data = await request.validate(CarValidator)

    const car = await Car.create(data)

    await car.related('especifications').sync(data.especifications as number[])

    const cars = await Car.query().orderBy('id', 'desc').paginate(current_page, limit_per_page)

    return response.json({ messages: "Carro cadastrado com sucesso!", cars })
  }

  public async show({ }: HttpContextContract) { }

  public async update({ request, params, response }: HttpContextContract) {

    const { page, per_page } = request.qs()

    const current_page = page ? page : 1
    const limit_per_page = per_page ? per_page : 100

    const data = await request.validate(CarValidator)

    const car = await Car.find(params.id)

    if (!car) {
      return response.notFound({ error: "Carro não foi encontrado" })
    }

    await car.merge(data).save()

    await car.related('especifications').sync(data.especifications as number[])

    const cars = await Car.query().orderBy('id', 'desc').paginate(current_page, limit_per_page)

    return response.json({ messages: "Carro atualizado com sucesso!", cars })

  }

  public async destroy({ request, response, params }: HttpContextContract) {

    const { page, per_page } = request.qs()

    const current_page = page ? page : 1
    const limit_per_page = per_page ? per_page : 100

    const car = await Car.find(params.id)

    if (!car) {

      return response.notFound({ error: "Carro não foi encontrado" })

    }

    if (car.available === false) {
      return response.internalServerError({ error: "O Carro que você tentou excluir econtra-se alugado no momento!" })

    }

    await car.delete()

    const cars = await Car.query().orderBy('id', 'desc').paginate(current_page, limit_per_page)

    return response.json({ messages: "Carro deletado com sucesso!", cars })

  }

  public async images({ request, params, response }: HttpContextContract) {

    const car = await Car.find(params.id)

    if (!car) {
      return response.notFound({ error: 'Carro não existe' })
    }

    const files = request.files('files', {
      size: '2mb',
      extnames: ['jpg', 'png', 'gif'],
    })

    //Retorna todos os erros.
    const errors: {}[] = []
    for (const file of files) {
      if (file.errors) {
        for (const fileErro of file.errors) {
          errors.push(fileErro)
        }
      }
    }

    if (errors.length > 0) {
      return response.internalServerError(errors)
    }


    for (let image of files) {
      await image.moveToDisk('/cars')
      await car.related('carImages').create({ image: image.fileName })
    }

    return response.json({ message: 'Imagens salvas com sucesso!' })

  }
}
