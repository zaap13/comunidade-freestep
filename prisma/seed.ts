import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log(`Iniciando o seed...`)

  // Cria um usuário "Sistema" para ser o dono das músicas iniciais
  const systemUser = await prisma.user.upsert({
    where: { email: 'system@radio.com' },
    update: {},
    create: {
      email: 'system@radio.com',
      name: 'FreeStep Rádio',
      nick: 'FreeStepRádio',
    },
  })
  console.log(`Usuário "${systemUser.name}" criado/encontrado.`)

  const songs = [
    {
      title: "Stereo Love (Molella Remix)",
      artist: "Edward Maya & Vika Jigulina",
      youtubeId: "p-Z3YrHJ1sU",
      duration: 188,
      category: "Melodic",
    },
    {
      title: "Infinity 2008 (Klaas Vocal Mix)",
      artist: "Guru Josh Project",
      youtubeId: "jzy2dgEU_fA",
      duration: 210,
      category: "Classic",
    },
    {
      title: "He's A Pirate (Tiësto Remix)",
      artist: "Tiësto",
      youtubeId: "s12vB_i2a6A",
      duration: 425,
      category: "Aggressive",
    },
    {
        title: "Love Is Gone (feat. Chris Willis)",
        artist: "David Guetta",
        youtubeId: "BErK2A_23eI",
        duration: 201,
        category: "Melodic",
    }
  ]

  for (const song of songs) {
    await prisma.music.create({
      data: {
        title: song.title,
        artist: song.artist,
        youtubeId: song.youtubeId,
        duration: song.duration,
        category: song.category,
        status: 'approved',
        submittedById: systemUser.id,
      },
    })
    console.log(`Música "${song.title}" criada.`)
  }

  console.log(`Seed finalizado com sucesso.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })