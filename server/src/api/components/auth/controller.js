import { sign } from "../../../services/jwt";
import { success } from "../../../services/response";
import { User } from "../user";

export const login = async (req, res, next) =>
  User.findOne({ email: req.body.email }).then((user) => {
    if (user && user.authenticate(req.body.password)) {
      return (
        sign(user.id)
          .then((token) => ({ token, user: user.view(true) }))
          .then(success(res, 201))
          // .catch(next);
          .catch((err) => console.log(err))
      );
    }
    return res.status(400).json({
      valid: false,
      message: "invalid Credentials",
    });
  });
