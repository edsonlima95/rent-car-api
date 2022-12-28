import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'rents'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('car_id').references('cars.id')
      table.integer('user_id').references('users.id')

      table.dateTime('start_date').notNullable()
      table.dateTime('end_date').notNullable()
      table.integer('days').notNullable()
      table.dateTime('expected_return_date').nullable()

      table.decimal('total', 10, 2).notNullable()


      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
