import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "public", "uploads", "propostas_db");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export async function GET(req: NextRequest) {
  try {
    ensureDir();
    const { searchParams } = new URL(req.url);
    const p = searchParams.get("p");
    const id = searchParams.get("id");

    if (!p && !id) {
      return NextResponse.json({ error: "Parâmetro p ou id ausente" }, { status: 400 });
    }

    const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));
    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(DATA_DIR, file), "utf-8");
        const json = JSON.parse(content);
        if (
          (p && json.slug && json.slug.toLowerCase() === p.toLowerCase()) ||
          (id && json.id === id)
        ) {
          return NextResponse.json(json, {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Cache-Control": "no-cache",
            },
          });
        }
      } catch (e) {}
    }

    return NextResponse.json({ error: "Proposta não encontrada" }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    ensureDir();
    const body = await req.json();
    if (!body || (!body.id && !body.slug)) {
      return NextResponse.json({ error: "Dados da proposta inválidos" }, { status: 400 });
    }

    const filename = `${body.id || body.slug}.json`;
    const filePath = path.join(DATA_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(body, null, 2), "utf-8");

    return NextResponse.json({ success: true, id: body.id, slug: body.slug });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
