import {
  Heading,
  Box,
  Button,
  Flex,
  Icon,
  Input,
  Image,
  Text,
  useClipboard,
  useToast,
  Textarea,
} from "@chakra-ui/react";
import React, { lazy, Suspense,useRef, useEffect, useState } from "react";
import { DeleteIcon } from "@chakra-ui/icons";
import { IoCopyOutline } from "react-icons/io5";
import { GoPencil } from "react-icons/go";
import Download from "../components/Download";

export default function ImageGen() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [updatePrompt, setUpdatePrompt] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const light = JSON.parse(localStorage.getItem("light"));
  const [editId, setEditId] = useState(null);
  const toast = useToast();
 


  async function handleGenImages() {
    try {
      const res = await fetch(
        `https://askai-50ai.onrender.com/ai/Image/displayImages`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await res.json();

      setRefreshKey((prev) => prev + 1);
      setMessages(data);

      return true;
    } catch (error) {
      console.log(error);
    }
  }
  async function handleSendPrompt() {
    if (!prompt.trim()) return;
    setLoading(true);

    try {
      const res = await fetch(
        `https://askai-50ai.onrender.com/ai/Image/generateImage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            prompt,
          }),
        }
      );

      const data = await res.json();
      const output = data.data;
      if (res.ok) {
        setMessages((prev) => [...prev, { prompt, response: output }]);
        setPrompt("");
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  }
  async function handleDeleteChat(id) {
    try {
      const res = await fetch(
        `https://askai-50ai.onrender.com/ai/Image/delete/${id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await res.json();
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to update the prompt.",
        status: "error",
        duration: 1500,
        isClosable: true,
      });
    }
  }

  async function handleUpdateChat(id) {
    try {
      // setEditId(id)
      const res = await fetch(
        `https://askai-50ai.onrender.com/ai/Image/updategeneratedImage/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            prompt: updatePrompt,
          }),
        }
      );
      const data = await res.json();
      console.log(data);
      const output = data.data;
      if (res.ok) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id == id
              ? {
                  ...msg,
                  prompt: updatePrompt,
                  imageData: output.imageData,
                  description: output.description,
                }
              : msg
          )
        );
      }
      setEditId(null);
      setUpdatePrompt("");
      toast({
        title: "Updated!",
        description: "Prompt and image updated successfully.",
        status: "success",
        duration: 1500,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to update the prompt.",
        status: "error",
        duration: 1500,
        isClosable: true,
      });
    }
  }

  useEffect(() => {
    handleGenImages();
  }, [refreshKey]);

 

  return (
    <Box pl={5} pr={5}>
      
      <Box>
        
        
        {/* Chat messages */}
        <Box
          flex="1"
          overflowY="auto"
           height={{ base: "80vh", sm: "80vh", md: "80vh", lg: "80vh", xl: "80vh" }}
          border="none"
          p={4}
          mb={4}
          borderRadius="md"
        >
         {messages.length>0?(messages.map((msg, idx) => (
            <Box key={idx} mb={3}>
              <Flex justifyContent={"flex-end"} alignItems="center" gap={2}>
                <Box
                  border={"solid"}
                  borderRadius={"md"}
                  p={2}
                  bg={light==true? "#edf2fa" : "gray"}
                >
                  {editId == msg._id ? (
                    <>
                      <Textarea
                        value={updatePrompt}
                        onChange={(e) => setUpdatePrompt(e.target.value)}
                        autoFocus
                      />
                      <Button
                        p={"none"}
                        bg={"none"}
                        value={updatePrompt}
                        onClick={() => handleUpdateChat(msg._id)}
                      >
                        ✓
                      </Button>
                      <Button
                        p={"none"}
                        bg={"none"}
                        onClick={() => setEditId(null)}
                      >
                        ✕
                      </Button>
                    </>
                  ) : (
                    <Text>{msg.prompt}</Text>
                  )}
                </Box>

                <Button
                  bg={light ? "blue.100" : "blue.800"}
                  color={light ? "black" : "white"}
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(msg.prompt);
                    toast({
                      title: "Copied!",
                      description: "Prompt copied to clipboard.",
                      status: "success",
                      duration: 1500,
                      isClosable: true,
                    });
                  }}
                >
                  <Icon as={IoCopyOutline} color={light ? "black" : "white"} />
                </Button>

                <Button
                  bg={"none"}
                  pt={1}
                  pb={1}
                  p={1}
                  onClick={() => {
                    setEditId(msg._id);
                    setUpdatePrompt(msg.prompt);
                  }}
                >
                  <Icon as={GoPencil} />
                </Button>
                <Button
                  bg={"none"}
                  pt={1}
                  pb={1}
                  p={1}
                  onClick={() => handleDeleteChat(msg._id)}
                >
                  <Icon as={DeleteIcon} />
                </Button>
              </Flex>

              <br />
              <Flex justifyContent={"flex-start"}>
                <Box boxSize="md" objectFit="cover">
                  <Flex>
                    <Box>
                      <Image src={msg.imageData} />
                    </Box>
                    <Box>
                      <Download link={msg.imageData} />
                    </Box>
                  </Flex>

                  <Text>{msg.description}</Text>
                </Box>
              </Flex>
              <br />
              {/* <br /> */}
            </Box>
          ))):(<><Flex minH="80vh" justifyContent="center" alignItems="center">
                        <Box>
                          <Heading fontSize={'5xl'}>Generate Image</Heading>
                        </Box>
                      </Flex></>)} 
        </Box>
      </Box>

      {/* Input prompt */}
      <Box display="flex" gap={2}>
        <Input
          placeholder="Ask something..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <Button
          colorScheme="blue"
          onClick={handleSendPrompt}
          isLoading={loading}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
}
