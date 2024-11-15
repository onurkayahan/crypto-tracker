import { MigrationInterface, QueryRunner, Table, TableUnique } from 'typeorm';

export class CreatePriceHistoryTable1731342875221
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable timescaledb extension if not enabled
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS timescaledb;`);

    // Create the price_history table
    await queryRunner.createTable(
      new Table({
        name: 'price_history',
        columns: [
          {
            name: 'id',
            type: 'int',
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'timestamp',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'pair',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'source',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'price',
            type: 'float',
            isNullable: false,
          },
        ],
        // Define composite primary key
        uniques: [
          {
            columnNames: ['id', 'timestamp'],
          },
        ],
      }),
      true,
    );

    // Add unique constraint on (pair, source, timestamp)
    await queryRunner.createUniqueConstraint(
      'price_history',
      new TableUnique({
        columnNames: ['pair', 'source', 'timestamp'],
      }),
    );

    // Convert price_history table to a hypertable
    await queryRunner.query(`
      SELECT create_hypertable('price_history', 'timestamp', if_not_exists => TRUE);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('price_history');
  }
}
