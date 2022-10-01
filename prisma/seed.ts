import { PrismaClient, Role, User } from '@prisma/client';
import { RolesEnum } from '../src/common/roles.enum';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('sedding data...');
  const roles = await createRoles();
  const admin = await createTestAdmin();
  const user = await createTestUser();

  console.log({ roles, admin, user });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });

async function createTestAdmin() {
  return createUser('admin@test.com', 'admin', [
    RolesEnum.ADMIN,
    RolesEnum.USER,
  ]);
}

async function createTestUser() {
  return createUser('user@test.com', 'admin', [RolesEnum.USER]);
}

async function createRoles(): Promise<Role[]> {
  const roles = [RolesEnum.ADMIN, RolesEnum.USER];
  const roleTasks = roles.map((role) => {
    return prisma.role.upsert({
      where: { name: role },
      create: { name: role },
      update: { name: role },
    });
  });
  return Promise.all(roleTasks);
}

async function createUser(
  username: string,
  password: string,
  roles: RolesEnum[],
): Promise<User> {
  const saltRounds = Number(process.env.PASSWORD_SALT_ROUNDS);
  const passwordHash = await hash(password, saltRounds);
  return prisma.user.upsert({
    where: { username },
    create: {
      password: passwordHash,
      username,
      roles: { connect: roles.map((role) => ({ name: role })) },
    },
    update: {
      username,
      password: passwordHash,
      roles: { connect: roles.map((role) => ({ name: role })) },
    },
    include: { roles: true },
  });
}
