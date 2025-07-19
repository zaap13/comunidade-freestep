import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log(`Iniciando o seed...`)
  const systemUser = await prisma.user.upsert({
    where: { email: 'system@radio.com' },
    update: {},
    create: {
      email: 'system@radio.com',
      name: 'FreeStep Rádio',
      nick: 'FreeStepRádio',
    },
  })

  const songs = [
    { title: "Jet Vesper", artist: "M.S. Project", youtubeId: "cKgr9_gSjHk", duration: 250, category: "Melodic" },
    { title: "Summer Of '69 (Remix)", artist: "Bryan Adams", youtubeId: "D8CyzA2eD9M", duration: 326, category: "Classic" },
    { title: "Magic Melody", artist: "Beattraax", youtubeId: "m3262Pj01j8", duration: 233, category: "Aggressive" },
    { title: "Free-O", artist: "God-Head", youtubeId: "F1U0qP3aVvI", duration: 266, category: "Shuffle" }
  ];

  for (const song of songs) {
    await prisma.music.upsert({
      where: { youtubeId: song.youtubeId },
      update: {},
      create: { ...song, status: 'approved', submittedById: systemUser.id },
    });
    console.log(`Música "${song.title}" criada/verificada.`);
  }
  console.log(`Seed finalizado.`)
}

main().catch(e => console.error(e)).finally(async () => await prisma.$disconnect())