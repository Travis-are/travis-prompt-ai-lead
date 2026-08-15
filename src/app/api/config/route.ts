import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const config = await db.getConfig();
    const products = config ? await db.getProducts(config.id) : [];
    return NextResponse.json({ config, products });
  } catch {
    return NextResponse.json({ config: null, products: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const existing = await db.getConfig();

    let config;
    if (existing) {
      config = await db.updateConfig(existing.id, body.config);
    } else {
      config = await db.createConfig(body.config);
    }

    if (body.products && Array.isArray(body.products)) {
      for (const product of body.products) {
        if (product.id) {
          // update would go here if we had updateProduct
        } else {
          await db.createProduct({ ...product, configId: config.id });
        }
      }
    }

    return NextResponse.json({ success: true, config });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
