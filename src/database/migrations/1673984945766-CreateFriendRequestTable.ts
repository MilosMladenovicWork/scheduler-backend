import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFriendRequestTable1673984945766
  implements MigrationInterface
{
  name = 'CreateFriendRequestTable1673984945766';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "friend_request" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" character varying NOT NULL, "senderId" uuid NOT NULL, "receiverId" uuid NOT NULL, CONSTRAINT "UQ_3480812cafecf9155f4658b35ec" UNIQUE ("senderId", "receiverId"), CONSTRAINT "PK_4c9d23ff394888750cf66cac17c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "friend_request" ADD CONSTRAINT "FK_9509b72f50f495668bae3c0171c" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "friend_request" ADD CONSTRAINT "FK_470e723fdad9d6f4981ab2481eb" FOREIGN KEY ("receiverId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "friend_request" DROP CONSTRAINT "FK_470e723fdad9d6f4981ab2481eb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "friend_request" DROP CONSTRAINT "FK_9509b72f50f495668bae3c0171c"`,
    );
    await queryRunner.query(`DROP TABLE "friend_request"`);
  }
}
