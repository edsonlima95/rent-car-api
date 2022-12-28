import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'


export default class UserValidator {

  constructor(protected ctx: HttpContextContract) {}

  public refs = schema.refs({
    id: this.ctx.params.id ? this.ctx.params.id : null,
    email: this.ctx.request.input('email'),
    driver_license: this.ctx.request.input('driver_license'),
    admin: this.ctx.request.input('admin'),
  })

  public schema = schema.create({

    name: schema.string(),
    email: schema.string.optional([
      rules.email(),
      rules.unique({
        table: 'users', column: 'email', whereNot: {
          id: this.refs.id,
        }, where: {
          email: this.refs.email
        }
      }),
      /** 
       * null - significa que esta criando um novo, então o email será obrigatório
       * caso exista - significa que está editando, então não será obrigatório.
      */
      rules.requiredWhen("email", "=", null)
    ]),
    password: schema.string([
      rules.minLength(4),
      rules.confirmed()
    ]),
    driver_license: schema.string.optional([
      rules.maxLength(11),
      rules.unique({
        table: 'users', column: 'driver_license', whereNot: { id: this.refs.id },
        where: { 
          driver_license: this.refs.driver_license,
          admin: this.refs.admin
        
        }
      }),
      // rules.requiredWhen("driver_license", "=", null),
      rules.requiredWhen("admin", "=", false),
    ]),
    admin: schema.boolean.optional(), //O campo admin não é obrigado existir.
    avatar: schema.string.nullable() //O campo é obrigado existir, e seu valor tem que ser null.
  })

  public messages: CustomMessages = {

    'name.required': "Campo nome é obrigatório",

    'email': 'Ensira um email com formato inválido',
    'email.required': "Campo email é obrigatório",
    'email.unique': "Email já existe",

    'driver_license.requiredWhen': 'Numero da CNH é obrigatório',
    'driver_license.maxLength': 'Numero da CNH deve conter 11 digitos',
    'driver_license.unique': "CNH já existe",
  
    'password.minLength': 'Senha deve conter no minimo 4 caracteres',
    'password.required': "Campo password é obrigatório",
    'password_confirmation.confirmed': "As senhas não conferem"

  }
}
