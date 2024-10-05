import { ItineraryItem } from "./types"; // Assume the interface is defined in a separate file

const itineraryData: ItineraryItem[] = [
  {
    id: "1",
    day: 1,
    dates: new Date("2024-06-15"),
    city: "Paris",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=1473&q=80",
    slots: [
      {
        data_id: "0x89c259af336b3341:0xa4969e07ce3108de",
        location: "Eiffel Tower",
        time: {
          startTime: "09:00",
          endTime: "12:00",
        },
        description:
          "Begin your Parisian adventure with a visit to the iconic Eiffel Tower. Climb to the top for breathtaking views of the city. Afterwards, take a stroll through the charming streets of Montmartre and visit the Sacré-Cœur Basilica.",
      },
      {
        data_id: "ChIJD7fiBh9u5kcRYJSMaMOCCwQ",
        location: "Louvre Museum",
        time: {
          startTime: "14:00",
          endTime: "18:00",
        },
        description:
          "Explore the world-renowned Louvre Museum, home to thousands of works of art including the Mona Lisa. End your day with a romantic Seine river cruise, taking in the illuminated landmarks of Paris by night.",
      },
    ],
  },
  {
    id: "2",
    day: 2,
    dates: new Date("2024-06-16"),
    city: "Rome",
    image:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1396&q=80",
    slots: [
      {
        data_id: "ChIJYW1bO8jxLxMROQ5qLJjYNqA",
        location: "Colosseum & Roman Forum",
        time: {
          startTime: "08:00",
          endTime: "12:00",
        },
        description:
          "Start your Roman journey at the magnificent Colosseum. Explore this ancient amphitheater and learn about its rich history. Continue to the nearby Roman Forum to walk in the footsteps of ancient Romans and imagine life in the heart of the Roman Empire.",
      },
      {
        data_id: "ChIJZ0fA3IhuEmsR4Sv3dU3D0nE",
        location: "Vatican City",
        time: {
          startTime: "14:00",
          endTime: "18:00",
        },
        description:
          "Visit Vatican City, the smallest country in the world. Tour St. Peter's Basilica, marvel at its stunning architecture and artworks. Then, explore the Vatican Museums and end your visit in the Sistine Chapel to admire Michelangelo's breathtaking frescoes.",
      },
    ],
  },
  {
    id: "3",
    day: 3,
    dates: new Date("2024-06-17"),
    city: "Barcelona",
    image:
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    slots: [
      {
        data_id: "ChIJ5TCOcRaYpBIRCmZHTz37sEQ",
        location: "Sagrada Família & Park Güell",
        time: {
          startTime: "09:00",
          endTime: "13:00",
        },
        description:
          "Immerse yourself in Gaudí's architectural wonders. Start with the breathtaking Sagrada Família, Barcelona's most iconic landmark. Marvel at its intricate facades and learn about its ongoing construction. Then, head to Park Güell for its whimsical designs and panoramic views of the city.",
      },
      {
        data_id: "ChIJmQgQKzYjpBIRkLlJzIiXH1Q",
        location: "Las Ramblas & Gothic Quarter",
        time: {
          startTime: "15:00",
          endTime: "19:00",
        },
        description:
          "Explore the vibrant heart of Barcelona. Start with a stroll down Las Ramblas, the city's most famous street, filled with street performers and local vendors. Then, lose yourself in the narrow medieval streets of the Gothic Quarter, discovering hidden squares and charming cafes. End your day relaxing on Barceloneta beach, watching the sunset over the Mediterranean.",
      },
    ],
  },
];

export default itineraryData;
