import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CarValidator {

  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    id: this.ctx.params.id ? this.ctx.params.id : null,
    license_plate: this.ctx.request.input('license_plate'),
  })

  public schema = schema.create({

    name: schema.string(),
    brand: schema.string(),
    description: schema.string.optional(),
    daily_rate: schema.number(),
    fine_amount: schema.number(),
    available: schema.boolean(),
    especifications: schema.array.optional().members(schema.number()),
    license_plate: schema.string([
      rules.unique(
        {
          table: 'cars', column: 'license_plate', whereNot: {
            id: this.refs.id
          },
          where: { license_plate: this.refs.license_plate }
        }),
      rules.requiredWhen("license_plate", "=", null)

    ]),
    category_id: schema.number(),

  })

  public messages: CustomMessages = {

    'name.required': 'Campo nome é obrigatório',
    'brand.required': 'Campo marca é obrigatório',
    'daily_rate.required': 'Campo valor da diaria é obrigatório',
    'fine_amount.required': 'Campo valor da multa é obrigatório',
    'available.required': 'Campo disponibilidade é obrigatório',
    'license_plate.required': 'Campo placa é obrigatório',
    'license_plate.unique': 'Placa já existe',
    'category_id.required': 'Campo categoria é obrigatório',

  }

}
