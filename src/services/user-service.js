const User = require('../schemas/User')
//dá pra fazer o teste de integração aqui?
//quais os parametros devo usar pra saber se devo fazer ou não o teste de integração?
class UserService { //cria um novo usuário
    static async createUser({ name, email, password }) {
        const { id } = await User.create({
            name,
            email,
            password
        })

        return { id }
    }

    static async userExistsAndCheckPassword({email, password}) {
        const user = await User.findOne({ email })

        if(!user) {
            return false
        }

        if(password !== user.password) {
            throw { status: 400, message: 'As senhas não batem' }
        }

        return true
    }
}

module.exports = UserService