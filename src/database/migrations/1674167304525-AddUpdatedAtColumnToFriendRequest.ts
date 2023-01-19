import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUpdatedAtColumnToFriendRequest1674167304525
  implements MigrationInterface
{
  name = 'AddUpdatedAtColumnToFriendRequest1674167304525';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "friend_request" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "friend_request" DROP COLUMN "updatedAt"`,
    );
  }
}
