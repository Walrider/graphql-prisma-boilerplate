import prisma from "../../src/prisma"
import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs"

const userOne = {
    input: {
        name: 'Jen',
        email: 'jen@example.com',
        password: bcrypt.hashSync('Red12345')
    },
    user: undefined,
    jwt: undefined
}

const userTwo = {
    input: {
        name: 'Jeff',
        email: 'jeff@example.com',
        password: bcrypt.hashSync('Red123456')
    },
    user: undefined,
    jwt: undefined
}

const seedDatabase = async () => {
    await prisma.mutation.deleteManyUsers()

    userOne.user = await prisma.mutation.createUser({
        data: userOne.input
    })
    userOne.jwt = jwt.sign({userId: userOne.user.id}, process.env.JWT_SECRET)

    userTwo.user = await prisma.mutation.createUser({
        data: userTwo.input
    })
    userTwo.jwt = jwt.sign({userId: userTwo.user.id}, process.env.JWT_SECRET)
}

export { seedDatabase as default, userOne, userTwo }