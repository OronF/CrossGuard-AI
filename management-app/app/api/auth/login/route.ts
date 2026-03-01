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
  const jwtExpiry = process.env.JWT_EXPIRES_IN;
  if (!jwtSecret || !jwtExpiry) {
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

  // Set an HttpOnly Cookie (security attribute)
  const response = NextResponse.json({ message: 'Login successful' });
  response.cookies.set('authToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Enable HTTPS in the production environment
    sameSite: 'lax', // Prevent CSRF attacks
    maxAge: Number(process.env.JWT_EXPIRES_IN),
    path: '/'
  });

  return response;
}