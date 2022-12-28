import Mail from '@ioc:Adonis/Addons/Mail'
import Event from '@ioc:Adonis/Core/Event'


Event.on('new:user', async (user) => {

    await Mail.sendLater((message) => {
        message
            .from(`${process.env.MAIL_FROM}`)
            .to(user.email)
            .subject('Obrigado por se inscrever')
            .text(`
                 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse blandit convallis dolor,
                 quis scelerisque enim egestas quis. Sed vitae odio consequat, rutrum dui at, gravida nulla.
                 Sed accumsan lorem ut odio convallis, et euismod tellus fermentum. Donec hendrerit volutpat
                 ante eu semper. Suspendisse auctor ante non metus lobortis, et gravida ex tincidunt. 
                 Suspendisse eget mauris id erat dapibus egestas in vitae diam.
                 Maecenas eget porttitor neque. Nulla at ligula hendrerit, dictum mauris et, sollicitudin nibh.
          `)
    })
})

Event.on('success:rent', async (user) => {

    await Mail.sendLater((message) => {
        message
            .from(`${process.env.MAIL_FROM}`)
            .to(user.email)
            .subject('Parabéns, você acaba de alugar seu carro. Divirta-se!')
            .text(`
                 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse blandit convallis dolor,
                 quis scelerisque enim egestas quis. Sed vitae odio consequat, rutrum dui at, gravida nulla.
                 Sed accumsan lorem ut odio convallis, et euismod tellus fermentum. Donec hendrerit volutpat
                 ante eu semper. Suspendisse auctor ante non metus lobortis, et gravida ex tincidunt. 
                 Suspendisse eget mauris id erat dapibus egestas in vitae diam.
                 Maecenas eget porttitor neque. Nulla at ligula hendrerit, dictum mauris et, sollicitudin nibh.
          `)
    })

})

