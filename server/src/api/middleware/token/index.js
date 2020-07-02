import { verify } from "../../../services/jwt";
import { User } from "../../components/user";
export const token = (req, res, next) => {
  if (!req.headers.Authorization) {
    return res.status(403).json({
      valid: false,
      param: "Header",
      message: "Auth token missing",
    });
  }
  return verify(req.headers.Authorization)
    .then(({ id }) => User.findById(id))
    .then((user) =>
      user
        ? req.user
        : res.status(403).json({
            valid: false,
            param: "Header",
            message: "Malformed token",
          })
    )
    .then(next)
    .catch((err) =>
      err.message.includes("Cast to ObjectId failed")
        ? res.status(403).json({
            valid: false,
            param: "Header",
            message: "Malformed token",
          })
        : next(err)
    );
};
