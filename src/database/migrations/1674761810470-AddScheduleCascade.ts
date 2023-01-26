import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddScheduleCascade1674761810470 implements MigrationInterface {
  name = 'AddScheduleCascade1674761810470';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "schedule_participant_user" DROP CONSTRAINT "FK_c369a8b418d95274adf6af8bfb0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedule_creator_user" DROP CONSTRAINT "FK_af191e6f6d75071458bd695b997"`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedule_participant_user" ADD CONSTRAINT "FK_c369a8b418d95274adf6af8bfb0" FOREIGN KEY ("scheduleId") REFERENCES "schedule"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedule_creator_user" ADD CONSTRAINT "FK_af191e6f6d75071458bd695b997" FOREIGN KEY ("scheduleId") REFERENCES "schedule"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "schedule_creator_user" DROP CONSTRAINT "FK_af191e6f6d75071458bd695b997"`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedule_participant_user" DROP CONSTRAINT "FK_c369a8b418d95274adf6af8bfb0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedule_creator_user" ADD CONSTRAINT "FK_af191e6f6d75071458bd695b997" FOREIGN KEY ("scheduleId") REFERENCES "schedule"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedule_participant_user" ADD CONSTRAINT "FK_c369a8b418d95274adf6af8bfb0" FOREIGN KEY ("scheduleId") REFERENCES "schedule"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
