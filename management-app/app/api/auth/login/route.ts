import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { compare } from 'bcryptjs';
import { User } from '@/types/User.type'; // Custom user type
import bcrypt from 'bcryptjs';

// Mock database users (actually need to connect to the database)
const password = "123456"; // The plain text password
const salt = await bcrypt.genSalt(10); // Higher number = more secure but slower
const hashedPassword = await bcrypt.hash(password, salt);

const mockUsers: User[] = [
  { id: '1', username: 'admin', password: hashedPassword } // Hashed password
];

export async function POST(request: Request) {
  const { username, password } = await request.json();

  // Find the user
  const user = mockUsers.find(u => u.username === username);
  if (!user) {
    return NextResponse.json({ error: 'User does not exist' }, { status: 401 });
  }

  // Verify the password
  const isPasswordValid = await compare(password, user.password);
  if (!isPasswordValid) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  }

  // Generate JWT
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpiry = process.env.JWT_EXPIRES_IN || '1h';
  if (!jwtSecret) {
    // Fail fast in case env variables are missing
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  const signOptions: jwt.SignOptions = {
    expiresIn: jwtExpiry as jwt.SignOptions['expiresIn'],
  };

  const token = jwt.sign(
    { userId: user.id, username: user.username }, // The payload contains userid and username
    jwtSecret as jwt.Secret,
    signOptions
  );

  // Calculate maxAge in seconds (1h = 3600s, 7d = 604800s)
  const getMaxAge = (expiryStr: string): number => {
    const matches = expiryStr.match(/(\d+)([smhd]?)/);
    if (!matches) return 3600; // default 1 hour
    const value = parseInt(matches[1]);
    const unit = matches[2] || 's';
    const multipliers: { [key: string]: number } = {
      s: 1,
      m: 60,
      h: 3600,
      d: 86400
    };
    const maxAge = value * (multipliers[unit] || 3600);
    console.log(`getMaxAge(${expiryStr}): ${maxAge} seconds`);
    return maxAge;
  };

  // Set an HttpOnly Cookie (security attribute)
  const response = NextResponse.json({ message: 'Login successful' });
  response.cookies.set('authToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Enable HTTPS in the production environment
    sameSite: 'lax', // Prevent CSRF attacks
    maxAge: getMaxAge(jwtExpiry),
    path: '/'
  });

  return response;
}