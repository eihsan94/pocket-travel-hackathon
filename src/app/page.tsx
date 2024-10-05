/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { ItineraryCard } from "./components/ItineraryCard";
import {
  Box,
  HStack,
  VStack,
  Input,
  Button,
  Center,
  Text,
  Flex,
  Heading,
  Progress,
} from "@chakra-ui/react";
import { ItineraryItem } from "@/types";
import { Player } from "@lottiefiles/react-lottie-player";
import { FiCompass } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion"; // Import framer-motion for animations

// Import your Lottie JSON files
import loadingAnimation1 from "@/assets/loading.json";
import loadingAnimation2 from "@/assets/loading2.json";
import loadingAnimation3 from "@/assets/loading3.json";
import loadingAnimation4 from "@/assets/loading4.json";
import loadingAnimation5 from "@/assets/loading5.json";
import loadingAnimation6 from "@/assets/loading6.json";
import welcomeAnimation from "@/assets/welcome.json"; // Replace with your actual image path
import { FaMagnifyingGlass } from "react-icons/fa6";

export default function Home() {
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [itineraryItems, setItineraryItems] = useState<ItineraryItem[]>([]);
  const [responseString, setResponseString] = useState<string>("");
  const [sessionId, setSessionId] = useState<string | null>(null);

  // State to keep track of the current animation index
  const [currentAnimationIndex, setCurrentAnimationIndex] = useState<number>(0);

  // State for the progress value
  const [progress, setProgress] = useState<number>(0);

  // Array of loading animations
  const loadingAnimations = [
    loadingAnimation1,
    loadingAnimation2,
    loadingAnimation3,
    loadingAnimation4,
    loadingAnimation5,
    loadingAnimation6,
  ];

  useEffect(() => {
    let animationInterval: NodeJS.Timeout | null = null;
    let progressInterval: NodeJS.Timeout | null = null;

    if (loading) {
      // Animation change every 2 seconds (same as before)
      animationInterval = setInterval(() => {
        setCurrentAnimationIndex(
          (prevIndex) => (prevIndex + 1) % loadingAnimations.length
        );
      }, 2000);

      // Progress interval to finish within 20 seconds, updating every 100ms for smoother animation
      progressInterval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(progressInterval!);
            return 100;
          }
          return prevProgress + 100 / (15 * 10); // 20 seconds, 10 updates per second
        });
      }, 100); // Update every 100ms for a smoother progress
    } else {
      setCurrentAnimationIndex(0);
      setProgress(0);
    }

    return () => {
      if (animationInterval) clearInterval(animationInterval);
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [loading]);

  const fetchItineraryItems = async (data: any) => {
    const results: ItineraryItem[] = await fetch("/api/serp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((response) => response.json());
    return results;
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_AI_HOST}/keyword-search`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(sessionId ? { "X-Session-ID": sessionId } : {}),
          },
          body: JSON.stringify({
            session_id: sessionId || "",
            input: search,
          }),
        }
      );

      const data = await response.json();
      setSearch("");
      setResponseString("");

      if (data.response) {
        setResponseString(data.response);
        setItineraryItems([]);
      } else {
        setItineraryItems(await fetchItineraryItems(data));
      }
      setSessionId(data.session_id);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack spacing={8} px={8} pb={150} pt={8} overflow="auto">
      {/* Header */}
      <Flex
        w="100%"
        py={4}
        px={8}
        alignItems="center"
        position="fixed"
        top={0}
        zIndex={1000}
        bg="rgba(255, 255, 255, 0.2)"
        backdropFilter="blur(10px)"
        borderBottom="1px solid rgba(255, 255, 255, 0.3)"
        shadow="md">
        <FiCompass size={24} color="orange" />
        <Heading as="h1" size="lg" ml={2} color="orange.500">
          Pocket Travel
        </Heading>
      </Flex>

      {/* Spacer to offset the fixed header */}
      <Box h="80px" />

      {loading && (
        <Center w="100%" h="60vh">
          <VStack spacing={4}>
            <Player
              autoplay
              loop
              src={loadingAnimations[currentAnimationIndex]}
              style={{ height: "50vh", width: "50vw" }}
            />
            <Text fontSize="2xl" fontWeight="bold" color="orange.500">
              Loading...
            </Text>
            <Box w="80%">
              <Progress
                colorScheme="orange"
                size="sm"
                value={progress}
                borderRadius="md"
                transition="width 0.2s ease" // Smooth transition with easing
              />
            </Box>
          </VStack>
        </Center>
      )}

      {!loading && itineraryItems.length === 0 && (
        <Center w="100%" h="60vh">
          <VStack spacing={6}>
            <Player
              autoplay
              loop
              src={welcomeAnimation}
              style={{ height: "50vh", width: "50vw" }}
            />
            <Text fontSize="2xl" fontWeight="bold" color="gray.600">
              Tell us where you want to go!
            </Text>
            <Text fontSize="md" color="gray.500" textAlign="center" maxW="80%">
              Start by entering a destination in the search bar below.
            </Text>
          </VStack>
        </Center>
      )}

      {/* Animate Presence for responseString */}
      <AnimatePresence>
        {responseString && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }} // Exit animation
            transition={{ duration: 0.5 }}>
            <Box w="100%" p={8} bg="orange.100" color="orange.800">
              <Text fontSize="lg" fontWeight="bold">
                {responseString}
              </Text>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animate Presence for Itinerary Items */}
      <AnimatePresence>
        {!loading &&
          itineraryItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }} // Exit animation
              transition={{ duration: 0.5, delay: i * 0.2 }}>
              <Box
                w={{
                  base: "80vw",
                  xl: "60vw",
                }}>
                <ItineraryCard
                  isLast={i === itineraryItems.length - 1}
                  isMiddle={i > 0}
                  {...item}
                />
              </Box>
            </motion.div>
          ))}
      </AnimatePresence>

      <Box
        w="100%"
        p={8}
        pos="fixed"
        bottom={0}
        bg="rgba(255, 255, 255, 0.2)"
        backdropFilter="blur(10px)"
        borderRadius="md"
        shadow="lg"
        border="1px solid rgba(255, 255, 255, 0.3)">
        <HStack spacing={4}>
          <Input
            placeholder="Search destinations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <Button
            bg="orange.400"
            color="white"
            _hover={{ bg: "orange.500" }}
            onClick={handleSearch}
            isLoading={loading}
            rightIcon={<FaMagnifyingGlass />}
            loadingText="Searching">
            Search
          </Button>
        </HStack>
      </Box>
    </VStack>
  );
}
