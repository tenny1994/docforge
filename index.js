const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // CREATE one row
  const created = await prisma.case.create({
    data: {
      title: 'First Document',
      content: 'Hello world',
    },
  });
  console.log('Created:', created);

  // READ all rows
  const all = await prisma.case.findMany();
  console.log('All cases:', all);
}

main()
  .catch((e) => {
    console.error('Error:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });