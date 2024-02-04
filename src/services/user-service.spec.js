const UserService = require('./user-service');
const User = require('../schemas/User');
jest.mock('../schemas/User');
describe('UserService', () => {
    beforeEach(() => {
        User.create.mockClear();
        User.findOne.mockClear();
    });
    it('deve criar um novo usuário', async () => {
        const mockUser = {name: 'Test', email: 'test@test.com', password: 'password'};
        User.create.mockResolvedValue({id: 1, ...mockUser});
        const result = await UserService.createUser(mockUser);
        expect(User.create).toHaveBeenCalledWith(mockUser);
        expect(result).toEqual({id: 1});
    });
    it('deve verificar se o usuário existe e a senha está correta', async () => {
        const mockUser = {email: 'test@test.com', password: 'password'};
        User.findOne.mockResolvedValue(mockUser);
        const result = await UserService.userExistsAndCheckPassword(mockUser);
        expect(User.findOne).toHaveBeenCalledWith({email: mockUser.email});
        expect(result).toBe(true);
    });
    it('Deve lançar um erro se a senha for incorreta', async () => {
        const mockUser = {email: 'test@test.com', password: 'password'};
        User.findOne.mockResolvedValue({...mockUser, password: 'wrongpassword'});
        await expect(UserService.userExistsAndCheckPassword(mockUser)).rejects.toEqual({ status: 400, message: 'As senhas não batem' });
    });
});