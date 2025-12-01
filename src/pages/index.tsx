import type { ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import useBaseUrl from '@docusaurus/useBaseUrl';

import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={styles.heroBanner}>
      <div className={styles.heroGradient} />

      {/* Floating shapes for subtle style */}
      <div className={styles.floatingShape1} />
      <div className={styles.floatingShape2} />
      <div className={styles.floatingShape3} />

      {/* Central content block */}
      <div className={styles.heroContent}>
        {/* Images Layer */}
       <div className={styles.heroImages}>
  <img
    src={useBaseUrl('img/AI-Humanoid-Robots.png')}
    alt="Book Cover"
    className={styles.heroBookCover}
  />
  <img
    src={useBaseUrl('img/image.png')}
    alt="Humanoid Robot"
    className={styles.heroRobotImage}
  />
</div>

        {/* Text Content */}
        <div className={styles.heroTextContent}>
          <div className={styles.heroLabel}>AI-Native Book Series</div>
          <Heading as="h1" className={styles.heroTitle}>
            Textbook & Course: <br/><br/>
            <span className={styles.heroTitleAccent}>
              Physical AI & Humanoid Robotics
            </span>
          </Heading>
          <p className={styles.heroSubtitle}>
            Focus & Theme: <strong>AI Systems in the Physical World — Embodied Intelligence</strong>
          </p>

        <div className={styles.heroButtons}>
  <Link
    className={styles.ctaButton}
    to="/docs/tutorial-intro" // Internal docs link
    target="_blank"            // Open in new tab
    rel="noopener noreferrer"
  >
    <span className={styles.buttonContent}>
      <span className={styles.buttonText}>Start Learning</span>
      <span className={styles.buttonIcon}>→</span>
    </span>
  </Link>
</div>

        </div>

        {/* Modules / Features below hero */}
        <div className={styles.heroModules}>
          <h3 className={styles.heroTitle}>Key Modules</h3>
          <div className={styles.modulesGrid}>
            {[
              "Robotic Nervous System (ROS 2) — Middleware, ROS 2 nodes, topics, services, URDF",
              "Digital Twin (Gazebo & Unity) — Physics simulation, rendering, sensors simulation",
              "AI-Robot Brain (NVIDIA Isaac™) — Perception, navigation, reinforcement learning",
              "Vision-Language-Action (VLA) — LLM integration, voice commands, capstone humanoid project"
            ].map((module, i) => (
              <div key={i} className={styles.moduleCard}>
                <div className={styles.moduleNumber}>Module {i + 1}</div>
                <p>{module}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="Physical AI & Humanoid Robotics"
      description="Textbook and Course on Physical AI, ROS 2, Gazebo, NVIDIA Isaac, and Humanoid Robotics. Hands-on learning and lab experience."
    >
      <HomepageHeader />
    </Layout>
  );
}
