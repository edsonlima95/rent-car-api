import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class EspecificationsCar extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public car_id: number

  @column()
  public especifications_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
