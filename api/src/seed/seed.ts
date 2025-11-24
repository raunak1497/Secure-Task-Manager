import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User, Role } from '../app/entities/user.entity';
import { Organization } from '../app/entities/organization.entity';

export async function runSeed(dataSource: DataSource) {
  const orgRepo = dataSource.getRepository(Organization);
  const userRepo = dataSource.getRepository(User);

  // 1. Ensure organization exists
  let org = await orgRepo.findOne({});
  if (!org) {
    org = orgRepo.create({ name: 'Default Organization' });
    await orgRepo.save(org);
    console.log('✔ Created Default Organization');
  }

  // 2. Users to seed
  const usersToSeed = [
    {
      email: 'owner@example.com',
      name: 'Owner User',
      role: Role.Owner,
      password: 'owner123',
    },
    {
      email: 'admin@example.com',
      name: 'Admin User',
      role: Role.Admin,
      password: 'admin123',
    },
    {
      email: 'viewer@example.com',
      name: 'Viewer User',
      role: Role.Viewer,
      password: 'viewer123',
    },
  ];

  // 3. Insert missing users
  for (const u of usersToSeed) {
    const exists = await userRepo.findOne({ where: { email: u.email } });

    if (!exists) {
      const hashed = await bcrypt.hash(u.password, 10);

      const newUser = userRepo.create({
        name: u.name,
        email: u.email,
        password: hashed,
        role: u.role,
        organization: org,
      });

      await userRepo.save(newUser);
      console.log(`✔ Seeded user: ${u.email}`);
    }
  }

  console.log("🌱 Database seeding complete.");
}