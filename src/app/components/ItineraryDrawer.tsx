import { ItineraryItem } from "@/types";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  VStack,
  Image,
  Text,
  Skeleton,
  SkeletonText,
  Stack,
  IconButton,
  HStack,
  DrawerProps,
} from "@chakra-ui/react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ItineraryDrawerProps extends DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  itinerarySlot: ItineraryItem["slots"][0];
  slotData: ItineraryItem["slots"][0];
  fetchSlotData: () => void;
}

export default function ItineraryDrawer(props: ItineraryDrawerProps) {
  const { isOpen, onClose, itinerarySlot, slotData, fetchSlotData } = props;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [loadedThumbnails, setLoadedThumbnails] = useState<number[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Handle fetching slot data when the drawer opens
  useEffect(() => {
    if (isOpen && !slotData) {
      fetchSlotData();
    }
  }, [isOpen, slotData, fetchSlotData]);

  // Handle image index and loading state
  useEffect(() => {
    if (slotData?.imageUrls) {
      setCurrentImageIndex(0);
      setIsImageLoading(true);
    }
  }, [slotData?.imageUrls]);

  // Initialize the IntersectionObserver and observe each thumbnail
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect(); // Disconnect any previous observer

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            if (!loadedThumbnails.includes(index)) {
              setLoadedThumbnails((prev) => [...prev, index]); // Mark thumbnail as loaded
            }
          }
        });
      },
      { rootMargin: "100px", threshold: 0.1 } // Ensure it starts loading before fully in view
    );

    const observedElements = document.querySelectorAll("[data-index]");
    observedElements.forEach((el) => observerRef.current?.observe(el)); // Observe all thumbnails

    return () => {
      observerRef.current?.disconnect(); // Cleanup observer on unmount or re-render
    };
  }, [loadedThumbnails, slotData]);

  const handlePrevious = () => {
    setDirection(-1);
    setIsImageLoading(true);
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? slotData.imageUrls!.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setDirection(1);
    setIsImageLoading(true);
    setCurrentImageIndex((prevIndex) =>
      prevIndex === slotData.imageUrls!.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  return (
    <>
      {props.children}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size={"md"}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {`Day ${itinerarySlot.time.startTime} - ${itinerarySlot.time.endTime} ${itinerarySlot.location}`}
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={4} alignItems="start" w="100%">
              {/* Image URLs Section with Slideshow */}
              {!slotData?.imageUrls ? (
                <Stack w="100%">
                  <Skeleton height="300px" rounded={"xl"} />
                </Stack>
              ) : (
                <Box w="100%" position="relative" height="300px">
                  <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                      key={currentImageIndex}
                      initial={{ opacity: 0, x: direction * 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: direction * -100 }}
                      transition={{ duration: 0.5 }}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                      }}>
                      {isImageLoading && (
                        <Skeleton
                          height="100%"
                          width="100%"
                          position="absolute"
                          top={0}
                          left={0}
                          borderRadius="xl"
                        />
                      )}
                      <Image
                        src={slotData.imageUrls[currentImageIndex]}
                        alt="Location Image"
                        objectFit="cover"
                        width="100%"
                        height="100%"
                        loading="lazy"
                        borderRadius="xl"
                        onLoad={handleImageLoad}
                        style={{
                          opacity: isImageLoading ? 0 : 1,
                          transition: "opacity 0.3s ease-in-out",
                        }}
                      />
                    </motion.div>
                  </AnimatePresence>

                  {slotData.imageUrls.length > 1 && (
                    <>
                      <IconButton
                        aria-label="Previous Image"
                        icon={<FiChevronLeft size={16} />}
                        position="absolute"
                        top="50%"
                        left="5px"
                        transform="translate(0, -50%)"
                        variant="ghost"
                        bg="rgba(255, 255, 255, 0.6)"
                        borderRadius="full"
                        onClick={handlePrevious}
                      />
                      <IconButton
                        aria-label="Next Image"
                        icon={<FiChevronRight size={16} />}
                        position="absolute"
                        top="50%"
                        right="5px"
                        transform="translate(0, -50%)"
                        variant="ghost"
                        bg="rgba(255, 255, 255, 0.6)"
                        borderRadius="full"
                        onClick={handleNext}
                      />
                    </>
                  )}
                </Box>
              )}

              {/* Static content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}>
                <Text fontSize="sm" color="gray.500">
                  {itinerarySlot.description}
                </Text>
              </motion.div>

              {/* Reviews Section with Lazy Loading Thumbnails */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}>
                <Box w="100%">
                  <Text fontWeight="bold" fontSize="lg" mb={2}>
                    Reviews:
                  </Text>
                  {slotData && slotData.reviews ? (
                    slotData.reviews.map((review, index) => (
                      <Box
                        key={index}
                        borderBottom="1px solid"
                        borderColor="gray.200"
                        py={4}>
                        <HStack alignItems="start" spacing={4}>
                          {review.user?.thumbnail ? (
                            <Box
                              position="relative"
                              width="50px"
                              height="50px"
                              ref={(el) => {
                                if (el && observerRef.current) {
                                  observerRef.current.observe(el);
                                }
                              }}
                              data-index={index}>
                              <Skeleton
                                isLoaded={loadedThumbnails.includes(index)}>
                                {loadedThumbnails.includes(index) && (
                                  <Image
                                    src={review.user.thumbnail}
                                    alt={review.user.name}
                                    boxSize="50px"
                                    borderRadius="full"
                                    loading="lazy"
                                  />
                                )}
                              </Skeleton>
                            </Box>
                          ) : (
                            <Box
                              boxSize="50px"
                              borderRadius="full"
                              bg="gray.300"
                            />
                          )}
                          <VStack align="start" spacing={1} flex={1}>
                            <HStack>
                              <Text fontWeight="bold">
                                {review.user?.name || "Anonymous"}
                              </Text>
                              {review.rating && (
                                <HStack spacing={1}>
                                  <Text>•</Text>
                                  <Text>{"⭐".repeat(review.rating)}</Text>
                                </HStack>
                              )}
                            </HStack>
                            <Text fontSize="xs" color="gray.500">
                              {review.date}
                            </Text>
                            <Text fontSize="sm" color="gray.700" mt={2}>
                              {review.snippet}
                            </Text>
                          </VStack>
                        </HStack>
                      </Box>
                    ))
                  ) : (
                    <SkeletonText mt="4" noOfLines={4} spacing="4" />
                  )}
                </Box>
              </motion.div>
            </VStack>
          </DrawerBody>

          <DrawerFooter>
            <Button
              bg="orange.200"
              as="a"
              target="_blank"
              href={`https://maps.google.com/?cid=${itinerarySlot.data_id}`}>
              View on Google Maps
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
