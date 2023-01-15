import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateScheduleTables1673814268107 implements MigrationInterface {
  name = 'CreateScheduleTables1673814268107';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "schedule_participant_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" character varying NOT NULL DEFAULT 'pending', "scheduleId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_8f1aa52612775b99b9695898621" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "schedule" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "dateRange" tsrange NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, CONSTRAINT "PK_1c05e42aec7371641193e180046" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "schedule_creator_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "scheduleId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_46f7b7d92ac7c4b8579662fd4bd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedule_participant_user" ADD CONSTRAINT "FK_c369a8b418d95274adf6af8bfb0" FOREIGN KEY ("scheduleId") REFERENCES "schedule"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedule_participant_user" ADD CONSTRAINT "FK_9a432828f38410ccb5be84da381" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedule_creator_user" ADD CONSTRAINT "FK_af191e6f6d75071458bd695b997" FOREIGN KEY ("scheduleId") REFERENCES "schedule"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedule_creator_user" ADD CONSTRAINT "FK_a0d5a633dcf4413cdca732b8ab2" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "schedule_creator_user" DROP CONSTRAINT "FK_a0d5a633dcf4413cdca732b8ab2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedule_creator_user" DROP CONSTRAINT "FK_af191e6f6d75071458bd695b997"`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedule_participant_user" DROP CONSTRAINT "FK_9a432828f38410ccb5be84da381"`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedule_participant_user" DROP CONSTRAINT "FK_c369a8b418d95274adf6af8bfb0"`,
    );
    await queryRunner.query(`DROP TABLE "schedule_creator_user"`);
    await queryRunner.query(`DROP TABLE "schedule"`);
    await queryRunner.query(`DROP TABLE "schedule_participant_user"`);
  }
}
