const SessionController = require("./session-ctrl");
const SessionService = require("../services/session-service");
const UserService = require("../services/user-service");
const Email = require("../utils/email-validator");

jest.mock("../services/session-service");
jest.mock("../services/user-service");
jest.mock("../utils/email-validator");

describe("SessionController", () => {
    it("Deve retornar um token quando um email e uma senha válidos são fornecidos.", async () => {
        const mockRequest = {
            body: {
                email: "teste@example.com",
                password: "password123",
            },
        };

        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Email.isValid.mockResolvedValue(true);
        UserService.userExistsAndCheckPassword.mockResolvedValue(true);
        SessionService.generateToken.mockResolvedValue("generated_token");

        await SessionController.create(mockRequest, mockResponse);

        expect(Email.isValid).toHaveBeenCalledWith("teste@example.com");
        expect(UserService.userExistsAndCheckPassword).toHaveBeenCalledWith({
            email: "teste@example.com",
            password: "password123",
        });
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            token: "generated_token",
        });
    });

    it("Deve retornar o status 400 e uma mensagem de erro caso o email seja inválido", async () => {
        const mockRequest = {
            body: {
                email: "valor.com",
                password: "password123",
            },
        };

        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Email.isValid.mockReturnValue(false);
        UserService.userExistsAndCheckPassword.mockResolvedValue(true);

        await SessionController.create(mockRequest, mockResponse);

        expect(Email.isValid).not.toHaveBeenCalledWith("teste@example.com");
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith("Email inválido");
    });

    it("Deve retornar o status 400 e uma mensagem de erro caso o senha seja inválido", async () => {
        const mockRequest = {
            body: {
                email: "teste@example.com",
                password: "",
            },
        };

        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        Email.isValid.mockReturnValue(true);
        UserService.userExistsAndCheckPassword.mockResolvedValue(false);
        await SessionController.create(mockRequest, mockResponse);

        expect(UserService.userExistsAndCheckPassword).not.toHaveBeenCalledWith(
            "password123"
        );

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith("Senha inválida");
    });

    it("Deve retornar 404 se o usuário não existir", async () => {
            const mockRequest = {
                body: {
                    email: "teste@example.com",
                    password: "password123",
                },
            };

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            Email.isValid.mockReturnValue(true)
            UserService.userExistsAndCheckPassword.mockResolvedValue(false);

             await SessionController.create(mockRequest, mockResponse);
            
             expect(mockResponse.status).toHaveBeenCalledWith(404)
             expect(mockResponse.json).toHaveBeenCalledWith("Usuário não encontrado");
    });
});
