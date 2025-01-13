import pactum from "pactum";
import cookie from "cookie";
import httpStatus from "http-status";

import { generateUser, insertUsers } from "../fixtures/user.fixture";

import { ACCESS_TOKEN_COOKIE_NAME } from "../../src/lib/constants";
import { verifyJwt } from "../../src/lib/jwt";

describe("Auth routes", () => {
  beforeAll(() => {
    pactum.request.setBaseUrl("http://localhost:4000");
  });

  describe("POST /auth/login", () => {
    test("should return 200 and login user if email and password match", async () => {
      const user = generateUser();
      await insertUsers([user]);

      const loginCredentials = {
        email: user.email,
        password: user.password,
      };

      pactum.handler.addCaptureHandler("access token", (ctx) => {
        return cookie.parse(ctx.res.headers["set-cookie"]?.[0] as string)[
          ACCESS_TOKEN_COOKIE_NAME
        ];
      });

      await pactum
        .spec()
        .post("/auth/login")
        .withBody(loginCredentials)
        .expectStatus(httpStatus.OK)
        .expect((ctx) => {
          const cookies = cookie.parse(
            ctx.res.headers["set-cookie"]?.[0] as string
          );
          expect(cookies).toHaveProperty(ACCESS_TOKEN_COOKIE_NAME);
          const payload = verifyJwt(cookies[ACCESS_TOKEN_COOKIE_NAME]!);
          expect(payload?.sub).toBe(user.id);
        })
        .stores("access_token", "#access token");
    });

    test("should return 201 and register user if there is no user with that email", async () => {
      const user = generateUser();
      const loginCredentials = {
        email: user.email,
        password: user.password,
      };

      await pactum
        .spec()
        .post("/auth/login")
        .withBody(loginCredentials)
        .expectStatus(httpStatus.CREATED)
        .expectJsonLike({
          isFirstTime: true,
        });
    });

    test("should return 401 error if password is wrong", async () => {
      const user = generateUser();
      await insertUsers([user]);
      const loginCredentials = {
        email: user.email,
        password: "wrongpassword",
      };

      await pactum
        .spec()
        .post("/auth/login")
        .withBody(loginCredentials)
        .expectStatus(httpStatus.UNAUTHORIZED)
        .expectBodyContains("Invalid credentials");
    });

    test("should return 400 error if input validation failed", async () => {
      const user = generateUser();
      await insertUsers([user]);
      const loginCredentials = {
        email: "example",
        password: "1234",
      };

      await pactum
        .spec()
        .post("/auth/login")
        .withBody(loginCredentials)
        .expectStatus(httpStatus.BAD_REQUEST);
    });
  });

  describe("POST /auth/logout", () => {
    test("should return 204 if logged out successfully", async () => {
      await pactum
        .spec()
        .post("/auth/logout")
        .withCookies(ACCESS_TOKEN_COOKIE_NAME, "$S{access_token}")
        .expectStatus(httpStatus.NO_CONTENT);
    });

    test("should return 401 error if access token cookie is missing or invalid", async () => {
      await pactum
        .spec()
        .post("/auth/logout")
        .expectStatus(httpStatus.UNAUTHORIZED)
        .expectBodyContains("Unauthorized");

      await pactum
        .spec()
        .post("/auth/logout")
        .withCookies(ACCESS_TOKEN_COOKIE_NAME, "invalidaccesstoken")
        .expectStatus(httpStatus.UNAUTHORIZED)
        .expectBodyContains("Unauthorized");
    });
  });
});
