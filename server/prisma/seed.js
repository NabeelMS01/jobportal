"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../src/utils/db"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function main() {
    const hashedPassword = await bcryptjs_1.default.hash('admin123', 10);
    const admin = await db_1.default.user.upsert({
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
    await db_1.default.job.createMany({
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
    await db_1.default.$disconnect();
});
//# sourceMappingURL=seed.js.map