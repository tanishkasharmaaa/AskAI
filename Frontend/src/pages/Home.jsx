import { Text, Box, Flex, Heading, Divider, Button } from "@chakra-ui/react";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const today = new Date(Date.now());
  const theme = JSON.parse(localStorage.getItem("theme"));
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = today.toLocaleDateString("en-US", options);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/textgen");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = () => {
    // 👇 Redirect to backend Google OAuth
    window.location.href = "https://askai-50ai.onrender.com/auth/google";
  };

  return (
    <Box p={4}>
      <Flex justifyContent={"center"}>
        <Text fontWeight={"light"} fontSize={"xl"}>
          {formattedDate}
        </Text>
      </Flex>
      {/** <Flex >*/}
      <Box textAlign={"center"}>
        <Heading
          fontFamily={
            '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif'
          }
          fontSize={"5xl"}
        >
          Introducing AskAI
        </Heading>
      </Box>

      {/**</Box></Flex>*/}
      <br />
      <Box>
        <Flex justifyContent={"center"}>
          <Text>
            Login to <strong>Try it out</strong>
          </Text>
        </Flex>
        <br />
        <Flex justifyContent={"center"}>
          <Button
            leftIcon={<FaGoogle />}
            colorScheme="red"
            variant="outline"
            size="md"
            px={6}
            py={2}
            borderRadius="md"
            _hover={{ bg: "red.50" }}
            onClick={handleLogin}
          >
            Login with Google
          </Button>
        </Flex>
      </Box>

      <Divider orientation="vertical" borderColor="white" />
      <Flex maxW="4xl" mx="auto" p={6} justifyContent={"center"}>
        <Text fontSize="md">
          We’ve built a model called <strong>AskAI</strong> that interacts in a
          conversational way to help users create and explore ideas more
          intuitively. AskAI is designed to handle a range of creative tasks —
          from generating human-like text to producing original images and even
          editing existing ones.
          <br />
          <br />
          The conversational interface allows AskAI to respond to follow-up
          questions, improve results through dialogue, and make creative
          suggestions. Whether you're writing content, imagining visuals, or
          refining images, AskAI makes the process seamless and interactive.
          <br />
          <br />
          AskAI combines the power of text and visual generation into one
          unified experience. During this early preview, AskAI is free to use —
          so you can explore its capabilities and help us learn how to improve
          it. Try it now and see what you can create.
        </Text>
      </Flex>
    </Box>
  );
}
