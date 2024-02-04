const SessionService = require("../services/session-service");

describe("SessionService", () => {
  beforeAll(() => {
    process.env.SECRET_KEY = "c420a756a520c980271e181c9b18f3f2";
  });
  it("Deve gerar um token válido", () => {
    const email = "user@gmail.com";
    const token = SessionService.generateToken({ email });

    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
  });

  it("Deve gerar um erro caso o e-mail não seja fornecido", () => {
    const invalidData = {
      email: "",
    };
    const res = SessionService.generateToken(invalidData);
    expect(typeof res).toBe("string");
  });
});