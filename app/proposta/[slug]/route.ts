import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const filePath = path.join(process.cwd(), "public", "Proposta.html");
  const fileContent = fs.readFileSync(filePath, "utf-8");

  return new NextResponse(fileContent, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
