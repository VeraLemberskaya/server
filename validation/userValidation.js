import { body } from "express-validator";

const userValidationRules = (field) => ({
  email: body(field ?? "email")
    .isEmail()
    .notEmpty(),
  name: body(field ?? "name").notEmpty(),
  surname: body(field ?? "surname").notEmpty(),
  password: body(field ?? "password")
    .notEmpty()
    .isLength({ min: 6 }),
});

class UserValidator {
  createUser() {
    return [
      userValidationRules().email,
      userValidationRules().name,
      userValidationRules().surname,
      userValidationRules().password,
    ];
  }
  updateUser() {
    return [
      userValidationRules().email,
      userValidationRules().name,
      userValidationRules().surname,
    ];
  }
  changePassword() {
    return [
      userValidationRules().password,
      userValidationRules("newPassword").password,
    ];
  }
}

export const userValidator = new UserValidator();
