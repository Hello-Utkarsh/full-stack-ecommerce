import { NextRequest, NextResponse } from "next/server";
const jwt = require("jsonwebtoken");

export async function POST(req: NextRequest) {
  try {

    const { cookie, key } = await req.json();
    const verifyUser = await jwt.verify(cookie, key);

    return NextResponse.json(verifyUser.user_id)

  } catch (error) {

    return NextResponse.json(
      { error: error.message },
      { status: error.status }
    );
     
  }
}
