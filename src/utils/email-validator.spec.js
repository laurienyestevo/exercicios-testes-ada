const Email = require('./email-validator')

describe('EmailValidator', () => {
    it ('Deve retornar true caso o email seja válido', () => {
        const validEmail = 'teste@gmail.com'
        const validator = Email.isValid(validEmail)
        expect(validator).toBe(true)
    })

    it ('Deve retornar false caso o email seja inválido', () => {
        const invalidEmail = 'teste@gm'
        const validator = Email.isValid(invalidEmail)
        expect(validator).toBe(false)
    })
})