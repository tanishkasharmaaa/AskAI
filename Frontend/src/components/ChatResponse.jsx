import { Box } from '@chakra-ui/react';
import Markdown from 'markdown-to-jsx';

export default function ChatResponse({ content }) {
  return (
    <Box
      p={4}
      borderRadius="md"
      fontSize="md"
      maxW="100%"
      overflowX="auto"
      whiteSpace="pre-wrap"
    >
      <Markdown>
        {content}
      </Markdown>
    </Box>
  );
}
