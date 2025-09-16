import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	if (pathname.startsWith("/")) {
		return NextResponse.next();
	}

	const token = req.cookies.get("token")?.value;

	if (!token) {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	return NextResponse.next();
}

// Middleware actif sur toutes les routes sauf API
export const config = {
	matcher: ["/((?!api).*)"],
};
