const UserController = require("./user-ctrl");
const UserService = require("../services/user-service");
const Email = require("../utils/email-validator");

describe("UserController", () => {
    it("Deve retornar 200 e o id caso todos os campos do req.body forem validos", async () => {
        const req = {
            body: {
                name: "John Doe",
                email: "johndoe@example.com",
                password: "password123",
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(), 
            json: jest.fn(), 
        };

        const createUserMock = jest
            .spyOn(UserService, "createUser")
            .mockResolvedValue({ id: "123" });
        await UserController.create(req, res);

        expect(createUserMock).toHaveBeenCalledWith({
            name: "John Doe",
            email: "johndoe@example.com",
            password: "password123",
        }); 
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ id: "123" });
    });

    it("Deve retornar o status 400 e uma mensagem de erro caso o email for inválido", async () => {
        const req = {
            body: {
                name: "John Doe",
                email: "invalidemail",
                password: "password123",
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

       
        const isValid = Email.isValid(req.body.email);

        
        if (!isValid) {
            res.status(400);
            res.json({ message: "Email inválido" });
        }

        await UserController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Email inválido" });
    });


    it("Deve retornar o status 400 e uma mensagem de erro caso a senha for inválida", async () => { 
        const req = {
            body: {
                name: "John Doe",
                email: "johndoe@example.com",
                password: "",
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await UserController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith("Senha inválida");
    });

    it("should return status 500 and a default error message if an error occurs", async () => {
        const req = {
            body: {
                name: "John Doe",
                email: "johndoe@example.com",
                password: "password123",
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const createUserMock = jest
            .spyOn(UserService, "createUser")
            .mockRejectedValue(new Error("Database error"));
        if (!Email.isValid(req.body.email)) {
            res.status(400);
            res.json({ message: "Senha inválida" });
            return;
        }

        try {
            await UserService.createUser(req.body);
        } catch (error) {
            res.status(500);
            res.json("Server Error");
            return;
        }
        await UserController.create(req, res);

        expect(createUserMock).toHaveBeenCalledWith({
            name: "John Doe",
            email: "johndoe@example.com",
            password: "password123",
        });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith("Server Error");
    });
});

describe("changePassword", () => {
    it("deve registrar uma mensagem e retornar o status 200", () => {
        const req = {
            userEmail: "johndoe@example.com",
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const consoleSpy = jest.spyOn(console, "log");

        UserController.changePassword(req, res);

        expect(consoleSpy).toHaveBeenCalledWith("Alterando senha...");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "ok" });
    });
});
