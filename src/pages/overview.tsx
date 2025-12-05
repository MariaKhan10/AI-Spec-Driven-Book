import React from 'react';
import clsx from 'clsx';
import styles from './overview.module.css'; // we’ll keep CSS

const modules = [
  {
    title: "Module 1: The Robotic Nervous System (ROS 2)",
    focus: "Middleware for robot control",
    content: [
      "ROS 2 Nodes, Topics, and Services",
      "Bridging Python Agents to ROS controllers using rclpy",
      "Understanding URDF for humanoids"
    ],
  },
  {
    title: "Module 2: The Digital Twin (Gazebo & Unity)",
    focus: "Physics simulation and environment building",
    content: [
      "Simulating physics, gravity, and collisions in Gazebo",
      "High-fidelity rendering and human-robot interaction in Unity",
      "Simulating sensors: LiDAR, Depth Cameras, and IMUs"
    ],
  },
  {
    title: "Module 3: The AI-Robot Brain (NVIDIA Isaac™)",
    focus: "Advanced perception and training",
    content: [
      "NVIDIA Isaac Sim: Photorealistic simulation and synthetic data generation",
      "Isaac ROS: Hardware-accelerated VSLAM and navigation",
      "Nav2: Path planning for bipedal humanoid movement"
    ],
  },
  {
    title: "Module 4: Vision-Language-Action (VLA)",
    focus: "LLM + Robotics",
    content: [
      "Voice-to-Action: Using OpenAI Whisper",
      "Cognitive Planning with LLMs to ROS 2 actions",
      "Capstone Project: Autonomous Humanoid end-to-end"
    ],
  },
];

export default function Overview() {
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Physical AI & Humanoid Robotics Curriculum</h1>
      <p className={styles.pageSubtitle}>
        Focus: AI Systems in the Physical World — Embodied Intelligence
      </p>

      <section className={styles.modulesSection}>
        <h2 className={styles.sectionTitle}>Key Modules</h2>
        <div className={styles.gridContainer}>
          {modules.map((mod, i) => (
            <div key={i} className={styles.moduleCard}>
              <div className={styles.moduleHeader}>
                <div className={styles.moduleNumber}>Module {i + 1}</div>
                <h3 className={styles.moduleTitle}>{mod.title}</h3>
                <p className={styles.moduleFocus}><strong>Focus:</strong> {mod.focus}</p>
              </div>
              <ul className={styles.moduleList}>
                {mod.content.map((point, j) => <li key={j}>{point}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Add more sections like Weekly Breakdown or Hardware Requirements here */}
    </div>
  );
}
