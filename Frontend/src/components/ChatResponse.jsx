import ReactMarkdown from 'react-markdown';
import { Box } from '@chakra-ui/react';
import remarkGfm from 'remark-gfm'; // for lists, tables, strikethroughs, etc.
import rehypeRaw from 'rehype-raw'; // if you allow HTML in markdown (optional)

export default function ChatResponse({ content }) {
  return (
    <Box
      p={4}
      
      borderRadius="md"
      fontSize="md"
      maxW="100%"
      overflowX="auto"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {content.response}
      </ReactMarkdown>
    </Box>
  );
}
