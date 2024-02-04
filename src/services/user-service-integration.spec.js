require("dotenv").config();
const UserService = require("./user-service");
const User = require("../schemas/User");
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");

const userMock = {
  name: faker.name.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password()
}


describe("Deve retornar um id ao ser criado um usuário e 'true' se o usário existir no banco ", () => {
  
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_DB_URL);
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  })
  it("deve criar um usuário e retornar seu id", async () => {

    const createuser = await UserService.createUser({
      name: userMock.name,
      email: userMock.email,
      password: userMock.password
    });

    expect(createuser).toHaveProperty("id");
    expect(createuser.id).toBeDefined();
    
  });

  it("Deve verificar se o usuário está autenticado", async () => {

    const user = await UserService.userExistsAndCheckPassword({email: userMock.email, password: userMock.password})
    expect(user).toBe(true);

  })
  
})
