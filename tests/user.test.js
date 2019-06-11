import '@babel/polyfill/noConflict'
import 'cross-fetch/polyfill'
import prisma from '../src/prisma'
import seedDatabase, { userOne } from './utils/seedDatabase'
import getClient from './utils/getClient'
import {createUser, login, getUsers, getProfile} from './utils/operations'

const client = getClient()

beforeEach(seedDatabase)

test('Should create a new user', async () => {
    const variables = {
        data: {
            name: "Gleb",
            email: "gleb@example.com",
            password: "MyPass123"
        }
    }

    const response = await client.mutate({
        mutation: createUser,
        variables
    })

    const userExists = await prisma.exists.User({id: response.data.createUser.user.id})

    expect(userExists).toBe(true)
})

test('Should expose public author profiles', async () => {
    const response = await client.query({query: getUsers})

    expect(response.data.users.length).toBe(2)
    expect(response.data.users[0].email).toBe(null)
    expect(response.data.users[0].name).toBe('Jen')
    expect(response.data.users[0].password).toBe('Password is hidden')
})

test('Should not login with bad credentials', async () => {
    const variables = {
        data: {
            email: "jen@example.com",
            password: "red12345"
        }
    }

    await expect(
        client.mutate({
            mutation: login,
            variables
        })
    ).rejects.toThrow()
})

test('Should not sign up with short password', async () => {
    const variables = {
        data: {
            name: "Gleb",
            email: "gleb@example.com",
            password: "MyPas"
        }
    }

    await expect(
        client.mutate({
            mutation: createUser,
            variables
        })
    ).rejects.toThrow()
})

test('Should fetch user profile', async () => {
    const client = getClient(userOne.jwt)

    const {data} = await client.query({query: getProfile})

    expect(data.me.id).toBe(userOne.user.id)
    expect(data.me.name).toBe(userOne.user.name)
    expect(data.me.email).toBe(userOne.user.email)
})