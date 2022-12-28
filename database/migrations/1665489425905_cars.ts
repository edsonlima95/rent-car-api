import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'cars'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('name').notNullable()
      table.string('brand').notNullable()
      table.string('description').nullable()
      table.decimal('daily_rate',10,2).notNullable() //Valor da diaria
      table.decimal('fine_amount',10,2).notNullable() //Valor da multa
      table.boolean('available').defaultTo(true)
      table.string('license_plate').notNullable()

      table.integer('category_id').references('categories.id')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
