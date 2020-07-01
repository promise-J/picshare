import { token } from ".";
import { signSync } from "../jwt";
import { User } from "../../api/user";
let res, next, req, user1;

beforeEach(async () => {
  user1 = await User.create({
    name: "user",
    email: "f@e.com",
    password: "123456",
  });
  req = {
    headers: {
      Authorization: signSync(user1.id),
    },
  };
  res = {
    status: jest.fn(() => res),
    json: jest.fn(() => res),
    end: jest.fn(() => res),
  };
  next = jest.fn(() => true);
});

describe("Token", () => {
  it("does not send any response when auth header is valid", async () => {
    await token(req, res, next)
    expect(res.status).not.toBeCalled();
    expect(res.json).not.toBeCalled();
  });

  it("responds with 403 when user cannot be found or invalid user id", async () => {
    await token({
      headers: {
        Authorization: signSync("12345567"),
      }
    }, res, next)

    expect(res.status).toBeCalledWith(403);
    expect(res.json).toBeCalledWith({
      valid: false,
      param: "Header",
      message: "Malformed token",
    });
  });

  it("does not send 403 response when object has not been passed", async () => {
    await token({ headers: {} }, res, next)
    expect(res.status).toBeCalledWith(403);
    expect(res.json).toBeCalledWith({
      valid: false,
      message: "Auth token missing",
      param: "Header"
    });
  });
});
