import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AuthValidator from 'App/Validators/AuthValidator'

interface AuthResponse {
    user: {
        id: number,
        name: string,
        email: string,
        avatar?: string,
    },
    token: string
}

export default class AuthController {


    public async login({ request, response, auth }: HttpContextContract) {

        const data = await request.validate(AuthValidator)

        try {


            const { token } = await auth.use('api').attempt(data.email as string, data.password, {
                expiresIn: '1 days'
            })

            const apiResponse: AuthResponse = {
                user: {
                    id: auth.user?.id as number,
                    name: auth.user?.name as string,
                    email: auth.user?.email as string,
                    avatar: auth.user?.avatar as string,
                },
                token
            }

            return apiResponse
        } catch {
            return response.unauthorized({ error: 'Email ou senha incorretos' })
        }

    }

    public async checkToken({ response, auth }) {

        try {

            await auth.use('api').authenticate()
            return auth.use('api').isAuthenticated

        } catch {
            return response.unauthorized({ error: 'token inválido' })
        }
    }

    public async logout({ auth }: HttpContextContract) {
        await auth.use('api').revoke()
        return {
            revoked: true
        }
    }

}
