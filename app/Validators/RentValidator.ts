import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RentValidator {
  constructor(protected ctx: HttpContextContract) { }


  public schema = schema.create({

    car_id: schema.number(),
    user_id: schema.number(),
    start_date: schema.string(),
    end_date: schema.string.optional(),
    expected_return_date: schema.string.optional(),
    total: schema.number.optional(),
    days: schema.number(),

  })

  public messages: CustomMessages = {
    'car_id.required': 'Campo carro é obrigatório',
    'user_id.required': 'Campo usuário é obrigatório',
    'start_date.required': 'Campo data de locação é obrigatório',
    'days.required': 'Campo dias é obrigatório',
  }
}
