/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ItineraryItem {
  id: string; //uuid
  day: number;
  dates: Date;
  city: string;
  image: string;
  slots: {
    data_id: string; // ai generated reference data id from google map search
    location: string; // we can use this to get the yelp data, reviews, etc
    imageUrls?: string[]; // on drawer open the frontend will fetch the images from the serp google maps photos data_id
    time: {
      startTime: string;
      endTime: string;
    };
    description: string; // things that the ai generated
    reviews?: any[]; // exactly the same structure as serp api frontend will fetch the reviews from the serp google maps reviews with data_id
  }[];
}

export interface TripData {
  response?: string;
  city: string;
  country: string;
  countryCode: string;
  days: number;
  startDate: string;
}

export interface SerpItem {
  data_id: string;
  category?: string;
  position: number;
  title: string;
  rating: number;
  address: string;
  operating_hours: {
    saturday: string;
    sunday: string;
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
  };
  description: string;
}
