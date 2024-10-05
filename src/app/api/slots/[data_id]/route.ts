import { getJson } from "serpapi";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { data_id: string } }
) {
  try {
    const { data_id } = params;
    let images = await getJson({
      engine: "google_maps_photos",
      data_id,
      api_key: process.env.SERP_API_KEY,
    });

    images = images.photos.map((p: { image: string }) => p.image);

    const result = await getJson({
      engine: "google_maps_reviews",
      data_id,
      api_key: process.env.SERP_API_KEY,
    });

    const { reviews } = result;

    return NextResponse.json({
      images,
      reviews,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Error fetching SERP data", error: errorMessage },
      { status: 500 }
    );
  }
}
