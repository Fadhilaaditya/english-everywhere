const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const db = require('../models');
const User = db.User;
const Student = db.Student;

exports.findAll = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', role = '', status = '' } = req.query;
        const pageNum = Math.max(1, parseInt(page) || 1);
        const limitNum = Math.max(1, parseInt(limit) || 10);
        const offset = (pageNum - 1) * limitNum;

        const rolesToShow = ['student', 'teacher'];
        if (req.userRole === 'superadmin') {
            rolesToShow.push('admin', 'superadmin');
        }

        let whereClause = {
            role: rolesToShow
        };

        // Filter by specific role if provided
        if (role) {
            const requestedRole = role.toLowerCase();
            if (rolesToShow.includes(requestedRole)) {
                whereClause.role = requestedRole;
            }
        }

        // Search by username or full name
        if (search) {
            whereClause[Op.or] = [
                { username: { [Op.like]: `%${search}%` } },
                { fullName: { [Op.like]: `%${search}%` } }
            ];
        }

        // Filter by student status if provided (requires join logic in findAndCountAll)
        let studentWhere = {};
        if (status) {
            studentWhere.status = status;
        }

        const { count, rows } = await User.findAndCountAll({
            where: whereClause,
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: db.Student,
                    as: 'studentProfile',
                    where: Object.keys(studentWhere).length > 0 ? studentWhere : undefined,
                    required: Object.keys(studentWhere).length > 0, // Inner join if status filter is active
                    include: [
                        {
                            model: db.Program,
                            as: 'program',
                            include: [{ model: db.Program, as: 'parent' }]
                        }
                    ]
                },
                { model: db.Teacher, as: 'teacherProfile' },
                { model: db.Admin, as: 'adminProfile' }
            ],
            limit: limitNum,
            offset: offset,
            order: [['fullName', 'ASC']],
            distinct: true
        });

        console.log(`[DEBUG] User.findAll - Total Found: ${count}, Page Size: ${rows.length}, limit: ${limitNum}, offset: ${offset}`);

        res.send({
            totalItems: count,
            users: rows,
            totalPages: Math.ceil(count / limitNum),
            currentPage: pageNum
        });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving users."
        });
    }
};

exports.findOne = async (req, res) => {
    const id = req.params.id;

    try {
        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] }, // Hide password from response
            include: [
                {
                    model: db.Student,
                    as: 'studentProfile',
                    include: [
                        {
                            model: db.Program,
                            as: 'program',
                            include: [{ model: db.Program, as: 'parent' }]
                        }
                    ]
                },
                { model: db.Teacher, as: 'teacherProfile' },
                { model: db.Admin, as: 'adminProfile' }
            ]
        });

        if (user) {
            res.send(user);
        } else {
            res.status(404).send({
                message: `Cannot find User with id=${id}.`
            });
        }
    } catch (err) {
        res.status(500).send({
            message: "Error retrieving User with id=" + id
        });
    }
};

exports.getStats = async (req, res) => {
    try {
        const rolesToCount = ['student', 'teacher'];
        if (req.userRole === 'superadmin') {
            rolesToCount.push('admin', 'superadmin');
        }

        const totalAccounts = await User.count({
            where: {
                role: rolesToCount
            }
        });
        const totalStudents = await Student.count();
        const totalTeachers = await User.count({ where: { role: 'teacher' } });

        res.send({
            totalAccounts,
            totalStudents,
            totalTeachers
        });
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving stats."
        });
    }
};

exports.create = async (req, res) => {
    const transaction = await db.sequelize.transaction();

    try {
        const { fullName, username, password, role, photo, ...profileData } = req.body;

        // 1. Check if user already exists
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            await transaction.rollback();
            return res.status(400).send({ message: "Username already exists!" });
        }

        // 2. Hash Password
        const bcrypt = require("bcryptjs");
        const hashedPassword = await bcrypt.hash(password || 'password123', 8);

        // 3. Create User
        const user = await User.create({
            fullName,
            username,
            password: hashedPassword,
            role,
            photo
        }, { transaction });

        // 4. Create Profile based on Role
        if (role === 'student') {
            await db.Student.create({
                userId: user.id,
                name: fullName,
                gender: profileData.gender || 'Male',
                address: profileData.address,
                phoneNumber: profileData.phone || '0',
                email: profileData.email || `${username}@example.com`,
                birthDate: profileData.birthDate,
                fatherName: profileData.fatherName || '',
                motherName: profileData.motherName || '',
                course: profileData.course,
                programId: profileData.programId,
                status: profileData.status || 'Waiting List'
            }, { transaction });
        } else if (role === 'teacher') {
            await db.Teacher.create({
                userId: user.id,
                name: fullName,
                gender: profileData.gender || 'Male',
                address: profileData.address,
                phoneNumber: profileData.phone || '0',
                email: profileData.email || `${username}@example.com`,
                birthDate: profileData.birthDate,
                specialization: profileData.specialization || '',
                bio: profileData.bio || ''
            }, { transaction });
        } else if (role === 'admin' || role === 'superadmin') {
            await db.Admin.create({
                userId: user.id,
                name: fullName,
                gender: profileData.gender || 'Male',
                address: profileData.address,
                phoneNumber: profileData.phone || '0',
                email: profileData.email || `${username}@example.com`,
                birthDate: profileData.birthDate
            }, { transaction });
        }

        await transaction.commit();
        res.status(201).send({ message: "Account created successfully!", userId: user.id });
    } catch (err) {
        await transaction.rollback();
        console.error("Create Error:", err);
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Account."
        });
    }
};

exports.delete = async (req, res) => {
    const id = req.params.id;
    const transaction = await db.sequelize.transaction();

    try {
        const user = await User.findByPk(id);
        if (!user) {
            await transaction.rollback();
            return res.status(404).send({ message: "User not found" });
        }

        const role = user.role;

        // Delete associated profiles first
        if (role === 'student') {
            await db.Student.destroy({ where: { userId: id }, transaction });
        } else if (role === 'teacher') {
            // Check if there are schedules or other dependent data if necessary
            await db.Teacher.destroy({ where: { userId: id }, transaction });
        } else if (role === 'admin' || role === 'superadmin') {
            await db.Admin.destroy({ where: { userId: id }, transaction });
        }

        // Finally delete the user
        await User.destroy({ where: { id: id }, transaction });

        await transaction.commit();
        res.send({ message: "Account deleted successfully!" });
    } catch (err) {
        await transaction.rollback();
        res.status(500).send({
            message: "Could not delete Account with id=" + id
        });
    }
};

exports.update = async (req, res) => {
    const id = req.params.id;
    const transaction = await db.sequelize.transaction();

    try {
        const user = await User.findByPk(id, {
            include: [
                {
                    model: db.Student,
                    as: 'studentProfile',
                    include: [
                        {
                            model: db.Program,
                            as: 'program',
                            include: [{ model: db.Program, as: 'parent' }]
                        }
                    ]
                },
                { model: db.Teacher, as: 'teacherProfile' }
            ]
        });

        if (!user) {
            await transaction.rollback();
            return res.status(404).send({ message: "User not found" });
        }

        const { fullName, username, password, role, photo, ...profileData } = req.body;

        // 1. Update User Record
        const userUpdateData = { fullName, username };
        if (photo) {
            userUpdateData.photo = photo;
        }
        if (password && password.trim() !== '') {
            const bcrypt = require("bcryptjs");
            userUpdateData.password = await bcrypt.hash(password, 8);
        }
        await user.update(userUpdateData, { transaction });

        // 2. Update Associated Profile
        if (user.role === 'student' && user.studentProfile) {
            await user.studentProfile.update({
                name: fullName,
                gender: profileData.gender,
                address: profileData.address,
                phoneNumber: profileData.phone,
                email: profileData.email,
                birthDate: profileData.birthDate,
                fatherName: profileData.fatherName,
                motherName: profileData.motherName,
                course: profileData.course,
                programId: profileData.programId,
                status: profileData.status || user.studentProfile.status
            }, { transaction });
        } else if (user.role === 'teacher' && user.teacherProfile) {
            await user.teacherProfile.update({
                name: fullName || user.teacherProfile.name,
                gender: profileData.gender || user.teacherProfile.gender,
                address: profileData.address || user.teacherProfile.address,
                phoneNumber: profileData.phone || user.teacherProfile.phoneNumber,
                email: profileData.email || user.teacherProfile.email,
                birthDate: profileData.birthDate || user.teacherProfile.birthDate,
                specialization: profileData.specialization || user.teacherProfile.specialization,
                bio: profileData.bio || user.teacherProfile.bio
            }, { transaction });
        } else if ((user.role === 'admin' || user.role === 'superadmin') && user.adminProfile) {
            await user.adminProfile.update({
                name: fullName || user.adminProfile.name,
                gender: profileData.gender || user.adminProfile.gender,
                address: profileData.address || user.adminProfile.address,
                phoneNumber: profileData.phone || user.adminProfile.phoneNumber,
                email: profileData.email || user.adminProfile.email,
                birthDate: profileData.birthDate || user.adminProfile.birthDate
            }, { transaction });
        }

        await transaction.commit();
        res.send({ message: "Account updated successfully!" });
    } catch (err) {
        await transaction.rollback();
        console.error("Update Error:", err);
        res.status(500).send({
            message: "Error updating Account with id=" + id
        });
    }
};

exports.importBulk = async (req, res) => {
    const fs = require('fs');
    const path = require('path');
    const bcrypt = require("bcryptjs");
    const logFile = path.join(__dirname, '../../import_debug.log');
    
    fs.appendFileSync(logFile, `!!! ENTERING IMPORT BULK (V5) !!! at ${new Date().toISOString()}\n`);
    
    const usersData = req.body.users || req.body; 
    if (!Array.isArray(usersData)) {
        fs.appendFileSync(logFile, `ERROR: Data is not an array: ${typeof req.body}\n`);
        return res.status(400).send({ message: "Data must be an array of objects" });
    }

    const results = { success: 0, failed: 0, errors: [] };

    for (const data of usersData) {
        let currentEmail = "not_set";
        let currentUsername = "unknown";
        let transaction = null;
        try {
            transaction = await db.sequelize.transaction();
            
            // 1. Basic Data Extraction
            const usernameStr = (data.username || data.fullName || 'unknown').toString().trim();
            const fullNameStr = (data.fullName || data.username || 'Unknown Name').toString().trim();
            const roleStr = (data.role || 'student').toString().toLowerCase().trim();
            currentUsername = usernameStr;
            const profileData = data.profileData || data;

            // 2. Helper for Excel Dates
            const excelDateToJS = (serial) => {
                return new Date(Math.round((serial - 25569) * 86400 * 1000));
            };

            // 3. Normalize Gender
            let gender = profileData.gender || 'Male';
            const g = gender.toString().toLowerCase().trim();
            if (['laki-laki', 'pria', 'male', 'l', 'm', 'laki laki', 'laki_laki'].includes(g)) gender = 'Male';
            else if (['perempuan', 'wanita', 'female', 'p', 'f', 'woman'].includes(g)) gender = 'Female';
            else gender = 'Male';

            // 4. Hardened Email Validation
            let email = profileData.email ? profileData.email.toString().trim() : '';
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email) || email.length < 5) {
                const safeUsername = usernameStr.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                email = `${safeUsername || 'user'}_${Math.floor(Math.random()*1000)}@example.com`;
            }
            currentEmail = email;

            // 5. Normalize BirthDate
            let birthDateRaw = profileData.birthDate || null;
            let birthDate = null;
            if (birthDateRaw) {
                let d;
                if (birthDateRaw instanceof Date) {
                    d = birthDateRaw;
                } else if (!isNaN(birthDateRaw)) {
                    const serial = parseFloat(birthDateRaw);
                    if (serial > 10000 && serial < 100000) d = excelDateToJS(serial);
                    else d = new Date(birthDateRaw);
                } else {
                    d = new Date(birthDateRaw);
                }
                if (d && !isNaN(d.getTime())) {
                    birthDate = d.toISOString().split('T')[0];
                }
            }

            fs.appendFileSync(logFile, `[DEBUG] Processing: ${usernameStr} | Final Email: ${email} | BirthDate: ${birthDate}\n`);

            // 6. User Account
            const hashedPassword = await bcrypt.hash('12345678', 8);
            const [user, createdUser] = await db.User.findOrCreate({
                where: { username: usernameStr },
                defaults: {
                    fullName: fullNameStr,
                    username: usernameStr,
                    password: hashedPassword,
                    role: roleStr
                },
                transaction
            });

            // 7. Profile
            if (roleStr === 'student') {
                let programId = profileData.programId;
                let courseName = (profileData.course || '').toString().trim();
                
                if (!programId && courseName) {
                    const program = await db.Program.findOne({ 
                        where: { 
                            title: { [Sequelize.Op.like]: courseName } 
                        } 
                    });
                    if (program) {
                        programId = program.id;
                        fs.appendFileSync(logFile, `[DEBUG] Matched Program "${courseName}" -> ID ${programId}\n`);
                    } else {
                        fs.appendFileSync(logFile, `[DEBUG] Failed to match Program title: "${courseName}"\n`);
                    }
                }

                const studentData = {
                    name: fullNameStr,
                    gender,
                    address: profileData.address || '',
                    phoneNumber: (profileData.phone || profileData.phoneNumber || '0').toString(),
                    email,
                    birthPlace: (profileData.birthPlace || '').toString(),
                    birthDate,
                    fatherName: (profileData.fatherName || profileData.parentName || '').toString(),
                    motherName: (profileData.motherName || '').toString(),
                    course: (profileData.course || '').toString(),
                    programId: programId || null,
                    status: profileData.status || 'Waiting List',
                    userId: user.id
                };

                const [student, createdProfile] = await db.Student.findOrCreate({
                    where: { userId: user.id },
                    defaults: studentData,
                    transaction
                });

                if (!createdProfile) {
                    await student.update(studentData, { transaction });
                }
            } else if (roleStr === 'teacher') {
                const teacherData = {
                    name: fullNameStr,
                    gender,
                    address: profileData.address || '',
                    phoneNumber: (profileData.phone || profileData.phoneNumber || '0').toString(),
                    email,
                    birthPlace: (profileData.birthPlace || '').toString(),
                    birthDate,
                    specialization: (profileData.specialization || '').toString(),
                    bio: (profileData.bio || '').toString(),
                    userId: user.id
                };

                const [teacher, createdProfile] = await db.Teacher.findOrCreate({
                    where: { userId: user.id },
                    defaults: teacherData,
                    transaction
                });

                if (!createdProfile) {
                    await teacher.update(teacherData, { transaction });
                }
            }

            await transaction.commit();
            results.success++;
        } catch (err) {
            if (transaction) await transaction.rollback();
            fs.appendFileSync(logFile, `Caught Error for row "${currentUsername}": ${err.message} | Email was: "${currentEmail}"\n`);
            results.failed++;
            results.errors.push({ username: currentUsername, message: err.message });
        }
    }

    res.send({
        message: `Import complete. ${results.success} success, ${results.failed} failed.`,
        summary: results
    });
};
