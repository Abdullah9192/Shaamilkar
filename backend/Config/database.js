const { PrismaClient } = require ('@prisma/client');
const prisma = new PrismaClient();


async function testConnection() {
  try {
    await prisma.$connect();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

testConnection();

module.exports = prisma;
