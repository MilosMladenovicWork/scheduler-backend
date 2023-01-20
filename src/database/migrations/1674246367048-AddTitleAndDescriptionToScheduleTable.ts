import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTitleAndDescriptionToScheduleTable1674246367048
  implements MigrationInterface
{
  name = 'AddTitleAndDescriptionToScheduleTable1674246367048';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "schedule" ADD "title" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedule" ADD "description" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "schedule" DROP COLUMN "description"`);
    await queryRunner.query(`ALTER TABLE "schedule" DROP COLUMN "title"`);
  }
}
