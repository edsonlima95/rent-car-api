import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'
import UserValidator from 'App/Validators/UserValidator'
import Drive from '@ioc:Adonis/Core/Drive'
import Event from '@ioc:Adonis/Core/Event'


export default class UsersController {


  public async index({ request, response }: HttpContextContract) {

    const { page, per_page } = request.qs()

    const currentPage = page ? page : 1
    const limitPerPage = per_page ? per_page : 100

    const users = await User.query()
      .orderBy('id', 'desc')
      .paginate(currentPage, limitPerPage)

    return response.json({ users })

  }

  public async store({ request, response }: HttpContextContract) {

    const data = await request.validate(UserValidator)

    const user = await User.create(data)

    //Evia um email para o usuario.
    // Event.emit('new:user', user)

    return response.json({ message: "Usuário cadastrado com sucesso!" })

  }

  public async show({ }: HttpContextContract) { }

  public async update({ request, params, response }: HttpContextContract) {

    const data = await request.validate(UserValidator)

    const user = await User.find(params.id)

    await user?.merge({
      ...data,
      password: data.password ? data.password : user.password
    }).save()

    return response.json({ message: "Usuário atualizado com sucesso!" })

  }

  public async destroy({ params, response }: HttpContextContract) {

    const user = await User.find(params.id)

    if (!user) {
      return response.notFound({ error: "Usuário não existe!" })
    }

    if (user.avatar) {
      Drive.delete(`./user/${user.avatar}`)
    }

    await user.delete()

    return response.json({ message: "Usuário deletado com sucesso!" })

  }

  public async avatar({ request, response, params }: HttpContextContract) {

    const user = await User.find(params.id)

    if (!user) {
      return response.notFound({ error: "Usuário não pode ser encontrado" })
    }

    //DEFINE AS REGRAS DE VALIDAÇÃO
    const avatarSchema = schema.create({
      avatar: schema.file.optional({
        size: '1mb',
        extnames: ['jpg', 'gif', 'png', 'jpeg', 'JPG', 'GIF', 'PNG', 'PNG', 'JPEG'],
      }),
    },)

    //USA AS REGRAS E COSTUMIZA AS MENSAGEM.
    const payload = await request.validate({
      schema: avatarSchema, messages: {
        "file.size": "Tamanho máximo do arquivo é de {{options.size}}",
        "file.extname": "Apenas os formatos {{options.extnames}} são válidos",
      }
    })

    //Verifica se existe uma imgam e remove.
    if (user.avatar) {
      Drive.delete(`./user/${user.avatar}`)
      await payload.avatar?.moveToDisk('./user')
    }

    const avatar = payload.avatar?.fileName

    await user.merge({ avatar }).save()

    return response.json(payload.avatar?.fileName)

  }

  public async image({ params, response }) {

    const image = await Drive.getStream(`/user/${params.image}`)

    return response.stream(image);
  }

}
