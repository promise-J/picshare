import request from "supertest";
import { apiRoot } from "../../config";
import { User } from "../user";
import { verify } from "../../services/jwt";
import express from "../../services/express";
import routes from ".";

const app = () => express(apiRoot, routes);

let user;

beforeEach(async () => {
  user = await User.create({
    name: "user",
    email: "c@c.com",
    password: "123456",
  });
});

test("POST /auth 201 (master)", async () => {
  const { status, body } = await request(app()).post(apiRoot).send({
    email: "c@c.com",
    password: "123456",
  });

  expect(status).toBe(201);
  expect(typeof body).toBe("object");
  expect(typeof body.token).toBe("string");
  expect(typeof body.user).toBe("object");
  expect(body.user.id).toBe(user.id);
  expect(await verify(body.token)).toBeTruthy();
});

test("POST /auth 400 (master) - invalid email", async () => {
  const { status, body } = await request(app()).post(apiRoot).send({
    email: "invalid",
    password: "123456",
  });
  expect(status).toBe(400);
  expect(typeof body).toBe("object");
});

test("POST /auth 400 (master) - invalid password", async () => {
  const { status, body } = await request(app())
    .post(apiRoot)
    .auth("a@a.com", "123");
  expect(status).toBe(400);
  expect(typeof body).toBe("object");
});

test("POST /auth 401 (master) - missing auth", async () => {
  const { status } = await request(app()).post(apiRoot);
  expect(status).toBe(400);
});
