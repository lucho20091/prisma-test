import "dotenv/config";
import { PrismaClient } from "./generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();
  const user = await prisma.user.create({
    data: {
      name: "kyle",
      email: "kyle@test.com",
      age: 27,
      userPreference: {
        create: {
          emailUpdates: true,
        },
      },
    },
    // include: {
    //   userPreference: true,
    // },
    select: {
      name: true,
      id: true,
      userPreference: true,
    },
  });
  // we create a post using the first user created
  const firstUserPost = await prisma.post.create({
    data: {
      title: "hello world",
      authorId: user.id,
      averageRating: 2,
    },
  });
  // update first user
  const update = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      name: "felipe",
    },
  });

  const updateNumberDinamically = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      age: {
        // increment: 1,
        // decrement: 1,
        // multiply: 10,
        divide: 2,
      },
    },
  });
  // we could connect a user to userpreferences using the id of the using preferences
  // and disconnect it if we dont need that anymore
  // first create userPreference with no userId and then later on associate it using connect property
  // this is available in create and update
  // it may be useful if we would like to preserve data but id not be associated to the user anymore
  // not sure what a real case can be unless to store data for the sake of it
  const updateEmailUpdates = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      userPreference: {
        update: {
          emailUpdates: false,
        },
      },
    },
  });
  const users = await prisma.user.createMany({
    data: [
      {
        name: "kyle",
        email: "kyle2@test.com",
        age: 50,
      },
      {
        name: "kyle",
        email: "kyle3@test.com",
        age: 22,
      },
      {
        name: "peter",
        email: "pete@test.com",
        age: 27,
      },
    ],
  });
  const updateMany = await prisma.user.updateMany({
    where: {
      name: "kyle",
    }, // <- Add this comma here
    data: {
      name: "sara",
    },
  });

  const deleteUser = await prisma.user.delete({
    where: {
      id: user.id,
    },
  });
  // find unique only works for attributes that are unique
  const findUser = await prisma.user.findUnique({
    where: {
      email: "kyle2@test.com",
    },
    select: {
      name: true,
      email: true,
      age: true,
    },
  });

  const findFirst = await prisma.user.findFirst({
    where: {
      name: "kyle",
    },
  });

  const findMany = await prisma.user.findMany({
    where: {
      name: "kyle",
    },
  });

  const findManyPagination = await prisma.user.findMany({
    where: {
      name: "kyle",
    },
    orderBy: {
      age: "desc",
      // age: "asc",
    },
    take: 2,
    skip: 2,
  });

  const findManyNotEqual = await prisma.user.findMany({
    where: {
      name: { not: "kyle" },
    },
    select: {
      id: true,
      name: true,
    },
  });

  const findManyInArray = await prisma.user.findMany({
    where: {
      age: {
        // in: [22, 27],
        // oposite is
        notIn: [22, 27],
      },
    },
  });

  const findManyOther = await prisma.user.findMany({
    where: {
      // name: "kyle",
      age: {
        // lte: 30,
        // lt: 30,
        // gt: 30,
        gte: 30,
      },
      email: {
        contains: "@test.com",
        startsWith: "kyle",
        endsWith: "@test.com",
      },
    },
  });

  const findManyAndOrNot = await prisma.user.findMany({
    where: {
      // AND: [{ email: { startsWith: "kyle" } }, { name: "kyle" }],
      // OR: [{ email: { startsWith: "kyle" } }, { email: { endsWith: "kyle" } }],
      NOT: { email: { startsWith: "kyle" } },
    },
  });

  const findManyRelations = await prisma.user.findMany({
    where: {
      writtenPosts: {
        every: {
          title: { contains: "hello world" },
        },
      },
    },
  });

  const findPost = await prisma.post.findMany({
    where: {
      author: {
        is: {
          age: 27,
        },
      },
    },
  });
  // console.log(user);
  // console.log(users);
  // console.log(findUser);
  // console.log(findFirst);
  // console.log(findMany);
  // console.log(findManyPagination);
  // console.log(findManyNotEqual);
  // console.log(findManyInArray);
  // console.log(findManyOther);
  // console.log(findManyAndOrNot);
  // console.log(findManyRelations);
  // console.log(findPost);
  // console.log(update);
  // console.log(updateMany);
  // console.log(updateEmailUpdates);
  // console.log(updateNumberDinamically);
  console.log(deleteUser);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
