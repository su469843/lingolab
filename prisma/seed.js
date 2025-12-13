import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    // Clear existing data (optional, but good for clean slate)
    // await prisma.word.deleteMany();
    // await prisma.sentence.deleteMany();

    // Words
    const words = [
        {
            word: 'Apple',
            phonetic: '/ˈæp.l/',
            meaning: '苹果',
            example: 'An apple a day keeps the doctor away.'
        },
        {
            word: 'Computer',
            phonetic: '/kəmˈpjuː.tər/',
            meaning: '电脑',
            example: 'I use a computer for programming.'
        },
        {
            word: 'Beautiful',
            phonetic: '/ˈbjuː.tɪ.fəl/',
            meaning: '美丽的',
            example: 'The sunset is beautiful.'
        },
        {
            word: 'Challenge',
            phonetic: '/ˈtʃæl.ɪndʒ/',
            meaning: '挑战',
            example: 'Learning English is a fun challenge.'
        },
        {
            word: 'Knowledge',
            phonetic: '/ˈnɒl.ɪdʒ/',
            meaning: '知识',
            example: 'Knowledge is power.'
        }
    ];

    for (const w of words) {
        const word = await prisma.word.create({ data: w });
        console.log(`Created word with id: ${word.id}`);
    }

    // Sentences
    const sentences = [
        {
            text: 'The quick brown fox jumps over the lazy dog.',
            translation: '敏捷的棕色狐狸跳过了懒狗。'
        },
        {
            text: 'Practice makes perfect.',
            translation: '熟能生巧。'
        },
        {
            text: 'Where there is a will, there is a way.',
            translation: '有志者事竟成。'
        },
        {
            text: 'Stay hungry, stay foolish.',
            translation: '求知若饥，虚心若愚。'
        },
        {
            text: 'Life is like a box of chocolates.',
            translation: '生活就像一盒巧克力。'
        }
    ];

    for (const s of sentences) {
        const sentence = await prisma.sentence.create({ data: s });
        console.log(`Created sentence with id: ${sentence.id}`);
    }

    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
