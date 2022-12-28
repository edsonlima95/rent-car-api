import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Event from '@ioc:Adonis/Core/Event'
import RentValidator from 'App/Validators/RentValidator'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone' // dependent on utc plugin
import Car from 'App/Models/Car'
import Rent from 'App/Models/Rent'
import User from 'App/Models/User'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault("America/Sao_Paulo")

export default class RentsController {


  public async index({ request, response }: HttpContextContract) {

    const { page, per_page } = request.qs()

    const current_page = page ? page : 1
    const limit_per_page = per_page ? per_page : 100

    const rents = await Rent.query()
      .orderBy('id', 'desc')
      .preload('car')
      .preload('user')
      .paginate(current_page, limit_per_page)

    return response.json({ rents })
  }

  public async store({ request, response }: HttpContextContract) {

    const data = await request.validate(RentValidator)

    const start_date = dayjs().format()
    const end_date = dayjs().add(data.days, 'day').format()

    const car = await Car.findOrFail(data.car_id)
    const user = await User.find(data.user_id)

    if (car?.available) {
      return response.internalServerError({ error: "O carro que você tentou alugar, não está disponivel" })
    }

    if (!user) {
      return response.notFound({ error: "Usuário não existe" })
    }


    await Rent.create({
      ...data,
      start_date,
      end_date,
      total: (data.days * car.daily_rate)
    })

    await car?.merge({ available: true }).save()

     //Emiti um email para o usuario.
    //  Event.emit('success:rent', user)

    return response.json({ message: "Carro alugado com sucesso!" })

  }

  public async show({ }: HttpContextContract) { }

  public async update({ request, response, params }: HttpContextContract) {


    const { date_return } = request.body()

    const rent = await Rent.query().where('user_id', params.id).where('car_id',params.car).first()

    //Faz as verificações
    if (!rent) {
      return response.notFound({ error: "Não foi encontrado nenhum aluguel para o usuário informado!" })
    }

    const is_before = dayjs(date_return).isBefore(rent.start_date)

    if (is_before) {
      return response.notFound({ error: "Data de retorno não pode ser menor que a data de inicio!" })
    }


    const car = await rent.related('car').query().first()

    if (!car?.available) {
      return response.internalServerError({ error: "Você já fez a devolução deste automovel!" })
    }

    //Data de entrega.
    const expected_return_date = dayjs(date_return).format()


    //Verifica quantos dias passou da data de entrega.s
    const days = dayjs(expected_return_date).diff(rent.end_date, 'days')

    //Calcula o valor a pagar com a multa.
    const total_payment = car?.fine_amount as number * days

    //Atualiza o valor a pagar com a multa, se a data for depois da data de entra.
    if (dayjs(expected_return_date).isAfter(rent.end_date)) {
      rent.total = Number(rent.total) + total_payment
    }

    rent.expected_return_date = expected_return_date

    //Salva os dados.
    const rent_updated = await rent.save()
    await car?.merge({ available: false }).save()

    const rentReponse = {
      data_estimada: dayjs(rent.end_date).format(),
      data_enteega: dayjs(expected_return_date).format(),
      valor_original: rent.days * car.daily_rate,
      valor_atualizado: rent_updated.total
    }

    return response.json({ message: "Carro devolvido com sucesso!", data: rentReponse })

  }

  public async destroy({ }: HttpContextContract) { }





}
