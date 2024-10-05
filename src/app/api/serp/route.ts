/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/serp/route.ts
import { NextResponse } from "next/server";
import { getJson } from "serpapi";
import axios from "axios";
import { TripData, SerpItem, ItineraryItem } from "@/types";

const SERP_API_KEY = process.env.SERP_API_KEY;

async function getSerpData(
  city: string,
  country: string,
  countryCode: string
): Promise<SerpItem[]> {
  const queries: { [key: string]: string } = {
    activities: "things to do",
    lunch: "lunch place",
    dinner: "dinner place",
  };

  async function scrapeData(
    category: string,
    query: string,
    countryCode: string
  ): Promise<SerpItem> {
    let serpResponse = await getJson({
      engine: "google_maps",
      q: query,
      hl: "en",
      gl: countryCode,
      type: "search",
      api_key: SERP_API_KEY,
    });
    serpResponse = serpResponse.local_results.slice(0, 10);

    const serpItem: SerpItem = serpResponse.map(
      (item: {
        data_id: string;
        position: number;
        title: string;
        gps_coordinates: { latitude: number; longitude: number };
        rating: number;
        reviews: number;
        types: string[];
        address: string;
        operating_hours: string;
        description: string;
        thumbnail: string;
        // service_options: string;
      }) => {
        const {
          data_id,
          position,
          title,
          rating,
          address,
          operating_hours,
          description,
          thumbnail,
          //   service_options,
        } = item;

        return {
          data_id,
          category,
          position,
          title,
          rating,
          address,
          operating_hours,
          description,
          image: thumbnail,
          //   service_options,
        };
      }
    );

    return serpItem;
  }

  const results = await Promise.all(
    Object.keys(queries).map((category) => {
      const query = `${queries[category]} in ${city}, ${country}`;
      return scrapeData(category, query, countryCode);
    })
  );

  return results.flat();
}

async function getItinerary(
  days: number,
  startDate: string,
  city: string,
  country: string,
  choices: SerpItem[]
): Promise<{ itineraryItems: ItineraryItem[] }> {
  const body = { days, startDate, city, country, choices };
  //   console.log(body);
  const planResponse = await axios.post(
    `${process.env.NEXT_PUBLIC_AI_HOST}/itinerary`,
    body,
    { headers: { "Content-Type": "application/json" } }
  );

  const planData = planResponse.data;
  return planData;
}

export async function POST(request: Request) {
  try {
    // const body = await request.json();
    // const { input } = body;
    const tripData = await request.json();

    const { city, country, countryCode, days, startDate } = tripData;

    const choices = await getSerpData(city, country, countryCode);

    const itinerary = await getItinerary(
      days,
      startDate,
      city,
      country,
      choices
    );
    const { itineraryItems } = itinerary;
    console.log(itineraryItems);

    return NextResponse.json(itineraryItems);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Error fetching SERP data", error: errorMessage },
      { status: 500 }
    );
  }
}
