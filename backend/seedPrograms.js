const db = require('./src/models');

const programs = [
    {
        title: 'Funny Phonics',
        price: 'Mulai Rp 350.000',
        desc: 'Belajar membaca & mengeja seru dengan metode Phonics.',
        image: '/class1.svg',
        category: 'REGULAR'
    },
    {
        title: 'Hi Kids!',
        price: 'Mulai Rp 350.000',
        desc: 'Kelas dasar anak-anak. Fokus pada Bahasa Inggris sehari-hari.',
        image: '/class2.svg',
        category: 'REGULAR'
    },
    {
        title: 'Oxford Phonics',
        price: 'Mulai Rp 350.000',
        desc: 'Metode Phonics dari Oxford untuk membaca & menulis handal.',
        image: '/class3.svg',
        category: 'REGULAR'
    },
    {
        title: 'Abracadabra',
        price: 'Mulai Rp 350.000',
        desc: 'Program seru untuk kosakata dasar & percakapan awal.',
        image: '/class4.svg',
        category: 'REGULAR'
    },
    {
        title: 'Get Smart',
        price: 'Mulai Rp 350.000',
        desc: 'Kurikulum dinamis, tingkatan 6 kemampuan dasar bahasa.',
        image: '/class5.svg',
        category: 'REGULAR'
    },
    {
        title: 'Full Blast',
        price: 'Mulai Rp 350.000',
        desc: 'Program lengkap untuk siswa. Kuasai English level menengah.',
        image: '/class6.svg',
        category: 'REGULAR'
    }
];

const seedPrograms = async () => {
    try {
        await db.sequelize.sync(); // Ensure tables sort of exist, though migration is better usually
        // But for this simple task, sync is likely used.
        // Actually, let's just create.

        console.log('Seeding programs...');

        // Optional: truncate table first to avoid duplicates if re-run
        // await db.Program.destroy({ where: {}, truncate: true });

        await db.Program.bulkCreate(programs);
        console.log('Programs seeded successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Failed to seed programs:', error);
        process.exit(1);
    }
};

seedPrograms();
