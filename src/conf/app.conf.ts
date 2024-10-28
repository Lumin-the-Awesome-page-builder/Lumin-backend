import { registerAs } from '@nestjs/config';

export default registerAs('main', () => {
  return {
    jwtSecret: process.env.JWT_SECRET,
  };
});
