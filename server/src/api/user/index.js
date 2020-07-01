import { Router } from "express";
import { middleware as body } from "bodymen";
import { create } from "./controller";
import { schema } from "./model";

export User, { schema } from "./model";

const router = new Router();

const { email, password, name, picture, role } = schema.tree;

/**
 * @api {post} /users Create user
 * @apiName CreateUser
 * @apiGroup User
 * @apiPermission master
 * @apiParam {String} access_token Master access_token.
 * @apiParam {String} email User's email.
 * @apiParam {String{6..}} password User's password.
 * @apiParam {String} [name] User's name.
 * @apiParam {String} [picture] User's picture.
 * @apiSuccess (Sucess 201) {Object} user User's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Master access only.
 * @apiError 409 Email already registered.
 */
router.post("/", body({ email, password, name, picture }), create);

export default router;
