const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { validateRequest, personalizationSchema } = require('../utils/validation');
const { sendResponse, successResponse, errorResponse } = require('../utils/response');

// Personalize chapter endpoint - GET /api/personalize
// Expected query params: ?chapter={chapterPath}&userId={userId}
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { chapter, userId } = req.query;

    if (!chapter) {
      const responseObj = errorResponse(
        'VALIDATION_ERROR',
        'Chapter parameter is required',
        400
      );
      return sendResponse(res, responseObj);
    }

    const user = req.user;

    // In a real implementation, this would fetch the chapter content and personalize it
    // based on the user's background preferences
    const personalizedContent = personalizeChapterContent(chapter, user);

    const responseObj = successResponse(
      {
        filename: chapter.split('/').pop() || chapter,
        content: personalizedContent,
        complexityLevel: determineComplexityLevel(user),
        transformationApplied: true,
        user_profile_used: {
          software_background: user.software_background,
          hardware_background: user.hardware_background
        }
      },
      'Chapter personalized successfully'
    );
    sendResponse(res, responseObj);
  } catch (error) {
    const responseObj = errorResponse(
      'PERSONALIZATION_ERROR',
      error.message,
      500
    );
    sendResponse(res, responseObj);
  }
});

// Personalize chapter endpoint - POST /api/personalize/chapter/{chapterId}
router.post('/chapter/:chapterId', authenticateToken, validateRequest(personalizationSchema), async (req, res) => {
  try {
    const { chapterId } = req.validatedData;
    const user = req.user;

    // In a real implementation, this would fetch the chapter content and personalize it
    // based on the user's background preferences
    const personalizedContent = personalizeChapterContent(chapterId, user);

    const responseObj = successResponse(
      {
        chapter_id: chapterId,
        title: `Personalized Chapter: ${chapterId}`,
        content: personalizedContent,
        personalization_applied: true,
        user_profile_used: {
          software_background: user.software_background,
          hardware_background: user.hardware_background
        }
      },
      'Chapter personalized successfully'
    );
    sendResponse(res, responseObj);
  } catch (error) {
    const responseObj = errorResponse(
      'PERSONALIZATION_ERROR',
      error.message,
      500
    );
    sendResponse(res, responseObj);
  }
});

// Helper function to determine complexity level based on user profile
function determineComplexityLevel(user) {
  const { software_background, hardware_background } = user;

  // Map backgrounds to numeric levels
  const mapBackgroundToLevel = (background) => {
    const bg = background.toLowerCase();

    if (bg.includes('beginner') || bg.includes('novice') || bg.includes('new') || bg === 'unknown' || !bg.trim()) {
      return 1; // beginner
    } else if (bg.includes('intermediate') || bg.includes('some experience')) {
      return 2; // intermediate
    } else {
      return 3; // advanced
    }
  };

  const softwareLevel = mapBackgroundToLevel(software_background);
  const hardwareLevel = mapBackgroundToLevel(hardware_background);

  // Calculate average level
  const averageLevel = (softwareLevel + hardwareLevel) / 2;

  // Return complexity level based on average
  if (averageLevel <= 1.5) {
    return 'beginner';
  } else if (averageLevel <= 2.5) {
    return 'intermediate';
  } else {
    return 'advanced';
  }
}

// Helper function to personalize chapter content based on user profile
function personalizeChapterContent(chapterId, user) {
  // This is a simplified example of personalization logic
  // In a real implementation, this would fetch actual chapter content
  // and adjust it based on user's background preferences

  const { software_background, hardware_background } = user;

  let difficultyLevel, contentDepth, exampleComplexity;

  // Determine difficulty based on user background
  switch(software_background) {
    case 'beginner':
      difficultyLevel = 'Basic';
      contentDepth = 'Introductory';
      exampleComplexity = 'Simple examples with detailed explanations';
      break;
    case 'intermediate':
      difficultyLevel = 'Moderate';
      contentDepth = 'Detailed';
      exampleComplexity = 'Practical examples with moderate complexity';
      break;
    case 'advanced':
      difficultyLevel = 'Advanced';
      contentDepth = 'In-depth';
      exampleComplexity = 'Complex examples with optimization techniques';
      break;
    default:
      difficultyLevel = 'Moderate';
      contentDepth = 'Balanced';
      exampleComplexity = 'Standard examples';
  }

  // Adjust based on hardware background
  let hardwareFocus;
  switch(hardware_background) {
    case 'low-end':
      hardwareFocus = 'Focus on resource-efficient solutions';
      break;
    case 'mid':
      hardwareFocus = 'Balanced hardware considerations';
      break;
    case 'high':
      hardwareFocus = 'High-performance hardware solutions';
      break;
    default:
      hardwareFocus = 'Balanced hardware considerations';
  }

  // Return personalized content
  return `
# Chapter: ${chapterId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
## Difficulty: ${difficultyLevel}
### Content Depth: ${contentDepth}

${exampleComplexity}

### Hardware Considerations:
${hardwareFocus}

This content has been personalized based on your background:
- Software Background: ${software_background}
- Hardware Background: ${hardware_background}

Additional resources and examples tailored to your experience level would be included here.
  `;
}

module.exports = router;