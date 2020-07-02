import { Router } from "express";
import { login } from "./controller";
import { middleware as body } from "bodymen";
import { schema } from "../user";

const { email, password } = schema;
const router = new Router();

/**
 * @api {post} /auth Authenticate
 * @apiName Authenticate
 * @apiGroup Auth
 * @apiHeader {String} Authorization Basic authorization with email and password.
 * @apiSuccess (Success 201) {String} token User `access_token` to be passed to other requests.
 * @apiSuccess (Success 201) {Object} user Current user's data.
 */
router.post(
  "/",
  // body({ email, password }),
  login
);

export default router;
