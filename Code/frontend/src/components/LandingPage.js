import {
  Box,
  Button,
  Heading,
  Text,
  Stack,
  VStack,
  Image,
  Grid,
  GridItem,
} from "@chakra-ui/react";

const LandingPage = ({ onGetStarted }) => {
  return (
    <Box as='section' bg='gray.100' py={20} textAlign='center' px={10}>
      <Heading fontSize={{ base: "3xl", md: "5xl" }} color='green.600'>
        Discover & Organize Your Favorite Recipes
      </Heading>
      <Text fontSize={{ base: "md", md: "xl" }} mt={4} color='gray.600'>
        Effortlessly search, organize, and share recipes with a few clicks.
      </Text>
      <Stack
        direction={{ base: "column", sm: "row" }}
        spacing={4}
        mt={8}
        justifyContent='center'
      >
        <Button size='lg' colorScheme='green' onClick={onGetStarted}>
          Get Started
        </Button>
      </Stack>

      {/* Additional Details Section */}
      <VStack mt={12} spacing={8} align='center'>
        <Heading size='lg' color='green.500'>
          Why Choose Saveurs Sélection?
        </Heading>

        {/* Full-width Image Grid for Features */}
        <Grid
          templateColumns={{ base: "1fr", md: "1fr 1fr" }}
          gap={0} // remove gaps to span the full width
          mt={4}
          width='100%' // Make grid take full width
        >
          {[
            {
              src: "https://miro.medium.com/v2/resize:fit:720/format:webp/0*wsWIB7I_n0XYMGca",
              title: "Search & Filter",
              description:
                "Quickly find recipes by ingredients, cuisine, or dietary preferences.",
            },
            {
              src: "https://www.labellerr.com/blog/content/images/2024/03/image--6-.webp",
              title: "Organize Your Collection",
              description:
                "Save your favorite recipes into personalized folders for easy access.",
            },
            // {
            //   src: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600",
            //   title: "Share with Friends",
            //   description:
            //     "Easily share your recipes and meal plans with family and friends.",
            // },
            {
              src: "https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=600",
              title: "Meal Planning",
              description:
                "Create and manage your weekly meal plans to simplify grocery shopping.",
            },
          ].map((feature, index) => (
            <GridItem
              key={index}
              position='relative'
              height='400px'
              overflow='hidden'
            >
              <Image
                src={feature.src}
                alt={feature.title}
                objectFit='cover'
                width='100%'
                height='100%'
                filter='brightness(0.7)' // Darkens the image slightly for better text readability
              />
              <Box
                position='absolute'
                top='50%'
                left='50%'
                transform='translate(-50%, -50%)'
                color='white'
                textAlign='center'
                bg='rgba(0, 0, 0, 0.6)' // Semi-transparent background for text
                p={4}
                borderRadius='md'
              >
                <Text fontSize='xl' fontWeight='bold'>
                  {feature.title}
                </Text>
                <Text fontSize='md'>{feature.description}</Text>
              </Box>
            </GridItem>
          ))}
        </Grid>
      </VStack>
    </Box>
  );
};

export default LandingPage;