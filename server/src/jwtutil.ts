import jwt from "jsonwebtoken";

interface Options {
  secret: string;
  [property: string]: any;
}

interface Token {
  [name: string]: string;
}

export function checkTokenFromHeader(authHeader: string, options: Options): Token {
  let token;

  const parts = authHeader.split(" ");
  if (parts.length == 2) {
    var scheme = parts[0];
    var credentials = parts[1];

    if (/^Bearer$/i.test(scheme)) {
      token = credentials;
    } else {
      throw new Error("Format is Authorization: Bearer [token]");
    }
  } else {
    throw new Error("Format is Authorization: Bearer [token]");
  }

  if (!token) {
    throw new Error("No authorization token was found");
  }

  var dtoken;

  try {
    dtoken = jwt.decode(token, { complete: true }) || {};
  } catch (err) {
    console.error(err);
    throw new Error("Invalid token");
  }

  let decoded;

  try {
    decoded = jwt.verify(token, options.secret, {});
  } catch (err) {
    console.error(err);
    throw new Error("Invalid token: " + err);
  }
  console.log("decoded", decoded);
  return decoded as Token;
}
