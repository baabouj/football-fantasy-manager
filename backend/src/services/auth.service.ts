import { userService } from "./user.service";
import { hash } from "../lib/hash";

export const authService = {
  login: async (email: string, password: string) => {
    const user = await userService.findByEmail(email);

    if (user) {
      // existing user login
      const isMatched = await hash.verify(user.password, password);

      if (!isMatched) {
        // wrong password
        return null;
      }

      const { password: _, ...rest } = user;

      return { user: rest, isFirstTime: false };
    }

    // register new user

    const hashedPassword = await hash.make(password);

    const { password: _, ...createdUser } = await userService.create(
      email,
      hashedPassword
    );

    return { user: createdUser, isFirstTime: true };
  },
};
