import prisma from '../src/utils/db';
import bcrypt from 'bcryptjs';

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@tnp.com' },
    update: {},
    create: {
      email: 'admin@tnp.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Admin user created:', admin.email);

  await prisma.job.createMany({
    data: [
      {
        title: 'Full Stack Developer',
        description: 'We are looking for a Full Stack Developer with React and Node.js experience.',
        category: 'Engineering',
        experienceLevel: 'Mid',
        location: 'Remote',
        salary: '$80,000 - $100,000',
        company: 'TNP India',
      },
      {
        title: 'Frontend Engineer',
        description: 'Join our team as a Frontend Engineer working with React and Tailwind CSS.',
        category: 'Engineering',
        experienceLevel: 'Junior',
        location: 'Bangalore, India',
        salary: '$40,000 - $60,000',
        company: 'TNP India',
      }
    ],
    skipDuplicates: true
  });

  console.log('Seed data inserted');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
