import {
  Box,
  Flex,
  Input,
  IconButton,
  Button,
  Text,
  useToast,
} from "@chakra-ui/react";
import { AttachmentIcon } from "@chakra-ui/icons";
import { useRef, useState } from "react";

export default function EditUploader({ handleSendPrompt, loading }) {
  const [instruction, setInstruction] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const toast = useToast();

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast({
        title: "File Attached",
        description: file.name,
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = () => {
    if (!instruction.trim() || !selectedFile) {
      toast({
        title: "Missing Fields",
        description: "Add both file and instruction.",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    handleSendPrompt(selectedFile, instruction);
    setInstruction("");
    setSelectedFile(null);
  };

  return (
    <Box p={4} maxW="800px" mx="auto" w="100%">
      {/* Hidden File Input */}
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {/* ChatGPT-style Input + Attach + Send */}
      <Flex gap={2}>
        <Flex position="relative" flex={1}>
          <Input
            placeholder="Type your instruction..."
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            pr="2.5rem"
          />
          <IconButton
            icon={<AttachmentIcon />}
            aria-label="Attach"
            variant="ghost"
            size="sm"
            onClick={handleFileClick}
            position="absolute"
            top="50%"
            right="2"
            transform="translateY(-50%)"
            zIndex="1"
          />
        </Flex>

        <Button
          colorScheme="blue"
          onClick={handleSubmit}
          isLoading={loading}
        >
          Send
        </Button>
      </Flex>

      {selectedFile && (
        <Text mt={2} fontSize="sm" color="gray.500">
          Attached: {selectedFile.name}
        </Text>
      )}
    </Box>
  );
}
