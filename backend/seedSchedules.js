const db = require('./src/models');

const seedSchedules = async () => {
    try {
        await db.sequelize.sync();

        console.log('Seeding schedules...');

        // Ensure Programs exist, we assume they have IDs 1-6 from previous seed.
        // Let's remove existing schedules first to be safe if re-running
        // await db.ProgramSchedule.destroy({ where: {}, truncate: true });

        const schedules = [
            // Schedules for Program 1 (Funny Phonics)
            { programId: 1, date: '2025-09-08', time: '09:00', status: 'AVAILABLE' },
            { programId: 1, date: '2025-09-08', time: '13:00', status: 'AVAILABLE' },
            { programId: 1, date: '2025-09-11', time: '13:00', status: 'PENDING' },

            // Schedules for Program 2 (Hi Kids!) - Different dates/times
            { programId: 2, date: '2025-09-09', time: '10:00', status: 'AVAILABLE' },
            { programId: 2, date: '2025-09-12', time: '14:00', status: 'AVAILABLE' },
            { programId: 2, date: '2025-09-12', time: '16:00', status: 'BOOKED' },

            // Should add more maybe later, but this proves the concept
        ];

        await db.ProgramSchedule.bulkCreate(schedules);

        console.log('Schedules seeded successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Failed to seed schedules:', error);
        process.exit(1);
    }
};

seedSchedules();
