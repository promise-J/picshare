import request from "supertest";
import { apiRoot } from "../../config";
import { signSync } from "../../services/jwt";
import express from "../../services/express";
import routes, { User } from ".";

const app = () => express(apiRoot, routes);

let user1, user2, session1, session2;

beforeEach(async () => {
  user1 = await User.create({
    name: "user",
    email: "a@a.com",
    password: "123456",
  });
  user2 = await User.create({
    name: "user",
    email: "b@b.com",
    password: "123456",
  });
  session1 = signSync(user1.id);
  session2 = signSync(user2.id);
});

test("POST /users 201 (master)", async () => {
  const { status, body } = await request(app()).post(apiRoot).send({
    email: "d@d.com",
    password: "123456",
  });
  expect(status).toBe(201);
  expect(typeof body).toBe("object");
  expect(body.email).toBe("d@d.com");
});

test("POST /users 409 (master) - duplicated email", async () => {
  const { status, body } = await request(app())
    .post(apiRoot)
    .send({ email: "a@a.com", password: "123456" });
  expect(status).toBe(409);
  expect(typeof body).toBe("object");
  expect(body.param).toBe("email");
});

test("POST /users 400 (master) - invalid email", async () => {
  const { status, body } = await request(app())
    .post(apiRoot)
    .send({ email: "invalid", password: "123456" });
  expect(status).toBe(400);
  expect(typeof body).toBe("object");
  expect(body.param).toBe("email");
});

test("POST /users 400 (master) - missing email", async () => {
  const { status, body } = await request(app())
    .post(apiRoot)
    .send({ password: "123456" });
  expect(status).toBe(400);
  expect(typeof body).toBe("object");
  expect(body.param).toBe("email");
});

test("POST /users 400 (master) - invalid password", async () => {
  const { status, body } = await request(app())
    .post(apiRoot)
    .send({ email: "d@d.com", password: "123" });
  expect(status).toBe(400);
  expect(typeof body).toBe("object");
  expect(body.param).toBe("password");
});

test("POST /users 400 (master) - missing password", async () => {
  const { status, body } = await request(app())
    .post(apiRoot)
    .send({ email: "d@d.com" });
  expect(status).toBe(400);
  expect(typeof body).toBe("object");
  expect(body.param).toBe("password");
});
