import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Car from './Car'
import User from './User'

export default class Rent extends BaseModel {


  @column({ isPrimary: true })
  public id: number

  @column()
  public car_id: number

  @column()
  public user_id: number

  @column()
  public start_date: string

  @column()
  public end_date: string

  @column()
  public days: number

  @column()
  public expected_return_date?: string

  @column()
  public total: number

  @belongsTo(() => Car, {
    foreignKey: 'car_id'
  })
  public car: BelongsTo<typeof Car>

  @belongsTo(() => User, {
    foreignKey: 'user_id'
  })
  public user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
