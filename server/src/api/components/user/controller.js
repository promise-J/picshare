import { success, notFound } from "../../../services/response";
import { User } from ".";

export const create = ({ bodymen: { body } }, res, next) =>
  User.create(body)
    .then((user) => user.view(true))
    .then(success(res, 201))
    .catch((err) => {
      if (err.name === "MongoError" && err.code === 11000) {
        res.status(409).json({
          valid: false,
          param: "email",
          message: "email already registered",
        });
      } else {
        next(err);
      }
    });
