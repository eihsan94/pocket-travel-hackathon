// route.ts
/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/serp/route.ts
import { NextResponse } from "next/server";
import { getJson } from "serpapi";
import axios from "axios";
import { SerpItem, ItineraryItem } from "@/types";
import { mapLanguageNameToHlCode } from "@/app/utils/language.utils";

const SERP_API_KEY = process.env.SERP_API_KEY;

async function getSerpData(
  city: string,
  country: string,
  countryCode: string,
  language: string,
  preferences?: string
): Promise<SerpItem[]> {
  const queries: { [key: string]: string } = {
    activities: "things to do",
    lunch: "lunch place",
    dinner: "dinner place",
  };

  async function scrapeData(
    category: string,
    query: string,
    countryCode: string,
    language: string
  ): Promise<SerpItem[]> {
    try {
      const hl = mapLanguageNameToHlCode(language);
      const serpQuery = {
        engine: "google_maps",
        q: query,
        hl,
        gl: countryCode,
        type: "search",
        api_key: SERP_API_KEY,
      };
      console.log(`serpQuery: ${JSON.stringify(serpQuery)}`);
      let serpResponse = await getJson(serpQuery);

      if (serpResponse.error) {
        throw new Error(serpResponse.error);
      }

      if (
        !serpResponse.local_results ||
        serpResponse.local_results.length === 0
      ) {
        console.warn(`No local results found for query: ${query}`);
        return [];
      }

      serpResponse = serpResponse.local_results.slice(0, 10);

      const serpItems: SerpItem[] = serpResponse.map(
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
          };
        }
      );

      return serpItems;
    } catch (error) {
      console.error(`Error in scrapeData for query: ${query}`, error);
      throw error;
    }
  }

  const results = await Promise.all(
    Object.keys(queries).map((category) => {
      let query = "";
      if (category === "activities" && preferences) {
        query = `${preferences} ${queries[category]} in ${city}, ${country}`;
      } else {
        query = `${queries[category]} in ${city}, ${country}`;
      }
      console.log(`Scraping data for ${query}`);
      return scrapeData(category, query, countryCode, language);
    })
  );

  return results.flat();
}

async function getItinerary(
  days: number,
  city: string,
  country: string,
  choices: SerpItem[],
  start_time?: string,
  end_time?: string,
  end_location?: string,
  preferences?: string,
  language?: string
): Promise<{ itineraryItems: ItineraryItem[] }> {
  const body = {
    days,
    city,
    country,
    choices,
    start_time,
    end_time,
    end_location,
    preferences,
    language,
  };
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
    const tripData = await request.json();

    const {
      city,
      country,
      countryCode,
      days,
      start_time,
      end_time,
      end_location,
      preferences,
      language,
    } = tripData;

    const choices = await getSerpData(
      city,
      country,
      countryCode,
      language,
      preferences
    );

    const itinerary = await getItinerary(
      days,
      city,
      country,
      choices,
      start_time,
      end_time,
      end_location,
      preferences,
      language
    );
    const { itineraryItems } = itinerary;

    return NextResponse.json(itineraryItems);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error in POST /api/serp:", errorMessage);
    return NextResponse.json(
      { message: "Error fetching SERP data", error: errorMessage },
      { status: 500 }
    );
  }
}
