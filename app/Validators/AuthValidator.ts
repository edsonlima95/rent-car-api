import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthValidator {
  constructor(protected ctx: HttpContextContract) { }


  public schema = schema.create({

    email: schema.string.optional([
      rules.email(),
    ]),
    password: schema.string([
      rules.minLength(4)
    ]),

  })


  public messages: CustomMessages = {
    
    'email': 'Ensira um email com formato inválido',
    'email.required': "Campo email é obrigatório",

    'password.minLength': 'Senha deve conter no minimo 4 caracteres',
    'password.required': "Campo password é obrigatório"
  }
}
