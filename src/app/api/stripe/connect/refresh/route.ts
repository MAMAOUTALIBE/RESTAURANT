import { NextRequest, NextResponse } from "next/server";
import { createRestaurantOnboardingLink } from "@/lib/stripe-connect";
import { siteConfig } from "@/lib/config";

export async function GET(request: NextRequest) {
  const restaurantId = request.nextUrl.searchParams.get("restaurant") ?? "";
  const fallback = `${siteConfig.url.replace(/\/$/, "")}/admin/parametres?stripe=refresh-error`;

  if (!restaurantId) {
    return NextResponse.redirect(fallback);
  }

  try {
    const onboardingUrl = await createRestaurantOnboardingLink(restaurantId);
    return NextResponse.redirect(onboardingUrl);
  } catch {
    return NextResponse.redirect(fallback);
  }
}
