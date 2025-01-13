import jwt from "jsonwebtoken";

export const generateJwt = (userId: string): string => {
  const token = jwt.sign({ sub: userId }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  return token;
};

export const verifyJwt = (token: string) => {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);

    return payload as { sub: string };
  } catch {
    return null;
  }
};
