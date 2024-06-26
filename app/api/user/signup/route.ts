import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/client";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(5),
  address: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, address } = await req.json();
    let parsedData = await User.safeParseAsync({
      name,
      email,
      password,
      address,
    });
    if (!parsedData.success) {
      return NextResponse.json(
        { message: "Incorrect Data type" },
        { status: 404 }
      );
    }
    const existingUser = await prisma.user.findFirst({
      where: { email: email },
    });
    if (existingUser) {
      return NextResponse.json(
        { message: "A user already exist with this email" },
        { status: 400 }
      );
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        address: address,
      },
    });

    const tokenData = {
      user_id: user.user_id,
      username: name,
      email: email,
    };

    const jwtToken = jwt.sign(tokenData, process.env.NEXT_PUBLIC_API_SECRET);

    const response = NextResponse.json({
      message: "Signup successful",
      sucess: true,
    });
    response.cookies.set("token", jwtToken);

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status }
    );
  }
}
