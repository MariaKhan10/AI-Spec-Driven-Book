import React, { useState, useEffect } from 'react';
import ContentPersonalizer from '../Personalization/ContentPersonalizer';
import { clientContentPersonalizer } from '../../services/ClientContentPersonalizer';

interface DocsContentPersonalizerProps {
  chapterPath: string;
  userId?: string;
}

const DocsContentPersonalizer: React.FC<DocsContentPersonalizerProps> = ({
  chapterPath,
  userId
}) => {
  const [content, setContent] = useState<string>('');

  // Load content from docs folder
  useEffect(() => {
    const loadContent = async () => {
      try {
        // Use the client content personalizer service instead of direct fetch
        const result = await clientContentPersonalizer.personalizeChapter(chapterPath, userId);
        setContent(result.content);
      } catch (error) {
        console.error('Error loading content:', error);
        setContent(`# Error\n\nCould not load content from ${chapterPath}`);
      }
    };

    loadContent();
  }, [chapterPath, userId]);

  return (
    <ContentPersonalizer
      content={content}
      userId={userId}
      chapterPath={chapterPath}
      fallbackContent={`# Content Loading Error\n\nFailed to load content from ${chapterPath}`}
    />
  );
};

export default DocsContentPersonalizer;