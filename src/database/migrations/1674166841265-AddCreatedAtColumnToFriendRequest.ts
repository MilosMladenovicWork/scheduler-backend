import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreatedAtColumnToFriendRequest1674166841265
  implements MigrationInterface
{
  name = 'AddCreatedAtColumnToFriendRequest1674166841265';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "friend_request" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "friend_request" DROP COLUMN "createdAt"`,
    );
  }
}
