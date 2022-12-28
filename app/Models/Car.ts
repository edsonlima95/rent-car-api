import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Category from './Category'
import Especification from './Especification'
import CarImage from './CarImage'

export default class Car extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public brand: string

  @column()
  public description?: string | null

  @column()
  public daily_rate: number

  @column()
  public fine_amount: number

  @column()
  public available: boolean

  @column()
  public license_plate: string

  @column()
  public category_id: number

  @belongsTo(() => Category, {
    foreignKey: 'category_id', // category_id coluna que representa a categoria em Carro.
  })
  public category: BelongsTo<typeof Category>

  @manyToMany(() => Especification, {
    pivotTable: 'especifications_cars',
    pivotForeignKey: 'car_id',
    pivotRelatedForeignKey: 'especification_id',
  })
  public especifications: ManyToMany<typeof Especification>

  @hasMany(() => CarImage, {
    foreignKey: 'car_id' //Coluna que representa um carro em CarImages.
  })
  public carImages: HasMany<typeof CarImage>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
