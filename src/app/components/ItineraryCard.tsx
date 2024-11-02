/* eslint-disable @typescript-eslint/no-explicit-any */
import { ItineraryItem } from "@/types";
import { Box, VStack, Image, Text, Flex, Circle } from "@chakra-ui/react";
import { useState } from "react";
import ItineraryDrawer from "./ItineraryDrawer";

const timelineColor = "orange.400";

interface ItineraryCardProps extends ItineraryItem {
  isLast?: boolean;
  isMiddle?: boolean;
}

export const ItineraryCard: React.FC<ItineraryCardProps> = (itinerary) => {
  const { isLast, isMiddle } = itinerary;
  const bottom = isLast ? "80px" : "0";
  const top = isLast ? "-4" : isMiddle ? "-5" : "0";
  const [selectedSlot, setSelectedSlot] = useState<string>("");

  // Cache for slot data
  const [slotDataCache, setSlotDataCache] = useState<{
    [data_id: string]: any;
  }>({});

  // Function to fetch data for a slot
  const fetchSlotData = async (slot: ItineraryItem["slots"][0]) => {
    const { data_id, language = "en" } = slot;
    if (slotDataCache[data_id]) {
      // Data already fetched; no need to fetch again
      return;
    }
    try {
      // post request
      const response = await fetch(`/api/slots/${data_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ language }),
      });
      const { images, reviews } = await response.json();
      setSlotDataCache((prevCache) => ({
        ...prevCache,
        [data_id]: {
          ...slot,
          imageUrls: images,
          reviews,
        },
      }));
    } catch (error) {
      console.error("Error fetching slot data:", error);
    }
  };

  const handleSlotClick = (slot: ItineraryItem["slots"][0]) => {
    setSelectedSlot(slot.data_id);
    // // Fetch data if not already in cache
    // if (!slotDataCache[slot.data_id]) {
    //   fetchSlotData(slot);
    // }
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      boxShadow="md"
      w="100%">
      <VStack align="start" spacing={4}>
        <Text fontWeight="bold" fontSize="xl">
          Day {itinerary.day} - {itinerary.city}
        </Text>
        <Flex
          gap={4}
          alignItems="start"
          w="100%"
          direction={{
            base: "column",
            md: "row",
          }}
          justifyContent={{
            base: "center",
            md: "start",
          }}>
          <Image
            display={{
              base: "none",
              md: "block",
            }}
            src={itinerary.image}
            alt={itinerary.image}
            boxSize="120px"
            objectFit="cover"
            borderRadius="150px 150px 0 0"
          />
          <Box
            position="relative"
            width="100%"
            mb="16"
            height="auto"
            display={{
              base: "block",
              md: "none",
            }}>
            {/* Blurred Background Image */}
            <Image
              src={itinerary.image}
              alt={`${itinerary.image}-blurred`}
              boxSize="100%"
              objectFit="cover"
              filter="blur(40px)"
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              zIndex="0"
            />

            {/* Main Foreground Image */}
            <Image
              src={itinerary.image}
              alt={itinerary.image}
              height={"120px"}
              objectFit="contain"
              borderRadius="xl"
              position="relative"
              zIndex="1"
              margin="auto"
            />
          </Box>

          {/* Wrap slots in a relative container */}
          <VStack align="start" spacing={4} w="100%" position="relative">
            {/* Dynamic vertical line */}
            <Box
              position="absolute"
              left="3px"
              top={top}
              bottom={bottom}
              width="2px"
              bg={timelineColor}
            />
            {itinerary.slots.map((slot) => (
              <ItineraryDrawer
                key={slot.data_id}
                itinerarySlot={slot}
                isOpen={selectedSlot === slot.data_id}
                onClose={() => {
                  setSelectedSlot("");
                }}
                slotData={slotDataCache[slot.data_id]}
                fetchSlotData={() => fetchSlotData(slot)}>
                <div
                  onClick={() => {
                    handleSlotClick(slot);
                  }}>
                  <Flex w="100%" align="start">
                    <Flex align="center" mr={4}>
                      <Circle size="8px" bg={timelineColor} />
                    </Flex>

                    <Flex
                      direction="column"
                      flex={1}
                      cursor="pointer"
                      transition="transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out"
                      _hover={{
                        transform: "scale(1.03)",
                        boxShadow: "lg",
                      }}
                      _active={{
                        transform: "scale(0.98)",
                      }}
                      px={4}
                      pb={4}
                      borderRadius="md">
                      <Text fontWeight="bold" fontSize="lg">
                        {slot.time.startTime} - {slot.time.endTime}{" "}
                        {slot.location}
                      </Text>
                      <Text fontSize="sm" color="gray.500" noOfLines={2}>
                        {slot.description}
                      </Text>
                    </Flex>
                  </Flex>
                </div>
              </ItineraryDrawer>
            ))}
          </VStack>
        </Flex>
      </VStack>
    </Box>
  );
};
