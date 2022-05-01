import { User } from "@prisma/client";
import { Authenticator } from "remix-auth";
import { sessionStorage } from "~/services/session.server";
import { FormStrategy } from "remix-auth-form";
import invariant from "invariant";
import { db } from "~/utils/db.server";
import { compare, hash } from "bcrypt";

const NUM_OF_SALTS = 10;

export async function hashPassword(password: string): Promise<string> {
  return hash(password, NUM_OF_SALTS);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return compare(password, hash);
}

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export let authenticator = new Authenticator<User>(sessionStorage);

// Tell the Authenticator to use the form strategy
authenticator.use(
  new FormStrategy(async ({ form, context }) => {
    let email = form.get("email") as string;
    let password = form.get("password") as string;

    // And finally, you can find, or create, the user
    let user = await db.user.findFirst({
      where: {
        email,
      },
      include: { password: { select: { hash: true } } },
    });

    invariant(user != null, "Error.UserNotFound");
    invariant(user.password != null, "password must not be empty");

    if (await comparePassword(password, user.password.hash)) {
      // Return the user as the Authenticator expects it
      console.log("user found");
      return user;
    } else {
      console.log("password not match");
      throw new Error("Password does not match");
    }
  }),
  // each strategy has a name and can be changed to use another one
  // same strategy multiple times, especially useful for the OAuth2 strategy.
  "user-pass"
);
