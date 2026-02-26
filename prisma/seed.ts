import { PrismaClient, ContactStatus, Role } from '@prisma/client';
import { hashPassword } from '../src/lib/auth';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@example.com';
  const adminPassword = 'admin1234';
  const passwordHash = await hashPassword(adminPassword);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Admin User',
      passwordHash,
      role: Role.admin
    }
  });

  const submissions = [
    {
      name: 'Sarah Chen',
      email: 'sarah@example.com',
      message: 'Hi! I would love to learn more about your services. Please reach out when you can.',
      status: ContactStatus.new
    },
    {
      name: 'Miguel Alvarez',
      email: 'miguel.alvarez@example.com',
      message: 'We are interested in a partnership. Can you share your media kit and pricing?',
      status: ContactStatus.read
    },
    {
      name: 'Priya Singh',
      email: 'priya.singh@example.com',
      message: 'Great landing page! Could you send more details about your upcoming release?',
      status: ContactStatus.new
    },
    {
      name: 'Noah Johnson',
      email: 'noah.j@example.com',
      message: 'Do you have an enterprise offering? Our team would like to schedule a demo.',
      status: ContactStatus.read
    },
    {
      name: 'Amina Yusuf',
      email: 'amina.y@example.com',
      message: 'Looking to switch providers. Please provide pricing and onboarding steps.',
      status: ContactStatus.new
    }
  ];

  for (const submission of submissions) {
    await prisma.contactSubmission.create({
      data: submission
    });
  }

  console.log('Seed complete', { adminUser: adminUser.email, contacts: submissions.length });
}

main()
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
