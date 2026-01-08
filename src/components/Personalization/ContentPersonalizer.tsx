import React, { useState, useEffect, useCallback } from 'react';
import { clientContentPersonalizer } from '../../services/ClientContentPersonalizer';


interface ContentPersonalizerProps {
  content: string;
  userId?: string;
  chapterPath?: string;
  fallbackContent?: string;
  className?: string;
}

const ContentPersonalizer: React.FC<ContentPersonalizerProps> = ({
  content,
  userId,
  chapterPath,
  fallbackContent = '',
  className = ''
}) => {
  const [personalizedContent, setPersonalizedContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Personalize content when component mounts or dependencies change
  useEffect(() => {
    const personalizeContent = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let resultContent: string;

        if (chapterPath && userId) {
          // If we have a chapter path, personalize from file
          const result = await clientContentPersonalizer.personalizeChapter(chapterPath, userId);
          resultContent = result.content;
        } else if (userId) {
          // If we have user ID but no chapter path, personalize provided content
          const result = await clientContentPersonalizer.personalizeContent(content, userId);
          resultContent = result.content;
        } else {
          // If no user ID, return original content (anonymous user)
          resultContent = content;
        }

        setPersonalizedContent(resultContent);
      } catch (err) {
        console.error('Error personalizing content:', err);
        // For anonymous users, fallback to original content
        if (!userId) {
          setPersonalizedContent(content);
        } else {
          setError('Failed to personalize content. Showing original content.');
          setPersonalizedContent(fallbackContent || content);
        }
      } finally {
        setIsLoading(false);
      }
    };

    personalizeContent();
  }, [content, userId, chapterPath, fallbackContent]);

  // Display loading state
  if (isLoading) {
    return (
      <div className={`${className} loading`}>
        <p>Loading personalized content...</p>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className={`${className} error`}>
        <p>{error}</p>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    );
  }

  // Display personalized content
  return (
    <div className={className}>
      <div
        dangerouslySetInnerHTML={{
          __html: personalizedContent
        }}
      />
    </div>
  );
};

export default ContentPersonalizer;