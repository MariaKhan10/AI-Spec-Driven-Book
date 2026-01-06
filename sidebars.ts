import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // Manual configuration with correct document IDs (based on error message)
  tutorialSidebar: [
    'introduction-embodied-ai-robotics',
    {
      type: 'category',
      label: 'Introducing Physical AI & Humanoid Robotics',
      items: [
        'Introducing_Physical_AI_&_Humanoid_Robotics/introducing-physical-ai-humanoid-robotics',
        'Introducing_Physical_AI_&_Humanoid_Robotics/introducing-physical-ai-humanoid-robotics-chapter1',
        'Introducing_Physical_AI_&_Humanoid_Robotics/introducing-physical-ai-humanoid-robotics-chapter2',
        'Introducing_Physical_AI_&_Humanoid_Robotics/introducing-physical-ai-humanoid-robotics-chapter3',
      ],
    },
    {
      type: 'category',
      label: 'Advanced AI For Robotics',
      items: [
        'Advanced-AI-For-Robotics/advanced-ai-for-robotics',
        'Advanced-AI-For-Robotics/advanced-ai-for-robotics-chapter4-nvidia-isaac-platform',
        'Advanced-AI-For-Robotics/advanced-ai-for-robotics-chapter5-vla-llms-robotics',
        'Advanced-AI-For-Robotics/advanced-ai-for-robotics-chapter6-humanoid-kinematics-control',
      ],
    },
    {
      type: 'category',
      label: 'Robotics Applications',
      items: [
        'robotics-applications/robotics-applications',
        'robotics-applications/robotics-applications-chapter7-conversational-robotics',
        'robotics-applications/robotics-applications-chapter8-capstone-autonomous-humanoid',
      ],
    },
  ],
};

export default sidebars;
