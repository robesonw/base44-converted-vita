import jwt from 'jsonwebtoken';

dotenv.config();

const signToken = (payload: object) => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET as string);
};

export { signToken, verifyToken };