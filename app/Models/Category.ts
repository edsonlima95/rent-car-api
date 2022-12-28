import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Car from './Car'

export default class Category extends BaseModel {
  @column({ isPrimary: true })

  public id: number

  @column()
  public name: string

  @column()
  public description?: string | null

  @hasMany(() => Car, {
    foreignKey: 'category_id' //Coluna que representa a categoria em Carro.
  })
  public cars: HasMany<typeof Car>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
