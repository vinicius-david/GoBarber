import {MigrationInterface, QueryRunner, TableForeignKey} from "typeorm";

export default class CreateForeignKeys1590497741593 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createForeignKey('appointments', new TableForeignKey({
        name: 'AppointmentProvider',
        columnNames: ['provider_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      }));
    };

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropForeignKey('appointments', 'AppointmentProvider');
    };

};
