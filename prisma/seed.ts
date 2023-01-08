import { Post, Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// モデル投入用のデータ定義
const postData: Post[] = [
    {
        id: 'fa119cb6-9135-57f5-8a5a-54f28d566d0e',
        title: 'タイトル１',
        createdAt: new Date("2022-01-31T04:34:22+09:00"),
        updatedAt: new Date("2022-01-31T04:34:22+09:00"),
    },
    {
        id: "fa119cb6-9135-57f5-8a5a-54f28d566d0b",
        title: "タイトル２",
        createdAt: new Date("2022-01-31T04:34:22+09:00"),
        updatedAt: new Date("2022-01-31T04:34:22+09:00"),
    },
    {
        id: "fa119cb6-9135-57f5-8a5a-54f28d566d0c",
        title: "タイトル３",
        createdAt: new Date('2022-01-31T04:34:22+09:00'),
        updatedAt: new Date("2022-01-31T04:34:22+09:00"),
    },
];

const doPostSeed = async () => {
    const posts = [];
    for (const post of postData) {
        const createPosts = prisma.post.create({
            data: post,
        });
        posts.push(createPosts);
    }
    return await prisma.$transaction(posts);
};

const main = async () => {
    console.log(`Start seeding ...`);

    await doPostSeed();

    console.log(`Seeding finished.`);
};

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
