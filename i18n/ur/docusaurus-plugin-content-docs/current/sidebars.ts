import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  // Manual configuration with correct document IDs (based on English version)
  tutorialSidebar: [
    'introduction-embodied-ai-robotics',
    {
      type: 'category',
      label: 'فزیکل AI اور ہیومنائیڈ روبوٹکس کا تعارف',
      items: [
        'Introducing_Physical_AI_&_Humanoid_Robotics/introducing-physical-ai-humanoid-robotics',
        'Introducing_Physical_AI_&_Humanoid_Robotics/introducing-physical-ai-humanoid-robotics-chapter1',
        'Introducing_Physical_AI_&_Humanoid_Robotics/introducing-physical-ai-humanoid-robotics-chapter2',
        'Introducing_Physical_AI_&_Humanoid_Robotics/introducing-physical-ai-humanoid-robotics-chapter3',
      ],
    },
    {
      type: 'category',
      label: 'روبوٹکس کے لیے ایڈوانس AI',
      items: [
        'Advanced-AI-For-Robotics/advanced-ai-for-robotics',
        'Advanced-AI-For-Robotics/advanced-ai-for-robotics-chapter4-nvidia-isaac-platform',
        'Advanced-AI-For-Robotics/advanced-ai-for-robotics-chapter5-vla-llms-robotics',
        'Advanced-AI-For-Robotics/advanced-ai-for-robotics-chapter6-humanoid-kinematics-control',
      ],
    },
    {
      type: 'category',
      label: 'روبوٹکس ایپلیکیشنز',
      items: [
        'robotics-applications/robotics-applications',
        'robotics-applications/robotics-applications-chapter7-conversational-robotics',
        'robotics-applications/robotics-applications-chapter8-capstone-autonomous-humanoid',
      ],
    },
  ],
};

export default sidebars;
