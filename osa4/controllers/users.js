const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')

usersRouter.get('/', async (request, response) => {
    console.log("fetching users...")
    const users = await User.find({})
    response.json(users)
})

usersRouter.post('/', async (request, response) => {
    const { username, name, password, passwordHash: providedPasswordHash } = request.body

    if (!password && !providedPasswordHash) {
        return response.status(400).json({ error: 'password or passwordHash is required' })
    }

    const userData = {
        username,
        name,
        passwordHash: providedPasswordHash
    }

    if (password) {
        const saltRounds = 10
        userData.passwordHash = await bcrypt.hash(password, saltRounds)
    }

    const user = new User(userData)
    const savedUser = await user.save()
    response.status(201).json(savedUser)
})

module.exports = usersRouter