import type { ReactNode } from "react";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import useBaseUrl from "@docusaurus/useBaseUrl";

import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={styles.heroBanner} role="banner" aria-label="Physical AI hero">
      <div className={styles.heroGradient} />

      {/* Particle canvas (pure CSS) */}
      <div className={styles.particles} aria-hidden />

      {/* Floating shapes for subtle style */}
      <div className={styles.floatingShape1} />
      <div className={styles.floatingShape2} />
      <div className={styles.floatingShape3} />

      <div className={styles.heroContent}>
        {/* Top strip: small metadata + badges */}
        <div className={styles.topStrip}>
          <span className={styles.badge}>AI-Native Book Series • 2025</span>
          <nav className={styles.quickLinks} aria-label="Quick links">
            <Link to="/AI-Spec-Driven-Book/docs/Introduction-Embodied-AI-&-Robotics" className={styles.linkSmall}>Start</Link>
            <Link to="/overview" className={styles.linkSmall}>Syllabus</Link>
          </nav>
        </div>

        {/* Main two-column wrapper (images + text) */}
        <div className={styles.heroMain}>
          {/* Images Layer */}
          <div className={styles.heroImages} aria-hidden>
            <img
              src={useBaseUrl("img/AI-Humanoid-Robots.png")}
              alt="Book cover — Physical AI"
              className={styles.heroBookCover}
            />
            <img
              src={useBaseUrl("img/image.png")}
              alt="Humanoid robot illustration"
              className={styles.heroRobotImage}
            />
            {/* hologram svg overlay */}
            <svg className={styles.holoGrid} viewBox="0 0 600 400" preserveAspectRatio="none" aria-hidden>
              <defs>
                <linearGradient id="g1" x1="0" x2="1">
                  <stop offset="0" stopColor="#00e5ff" stopOpacity="0.18" />
                  <stop offset="1" stopColor="#7b61ff" stopOpacity="0.06" />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#g1)" />
            </svg>
          </div>

          {/* Text Content */}
          <div className={styles.heroTextContent}>
            <div className={styles.heroLabel}>AI-Native Book Series</div>

            <Heading as="h1" className={styles.heroTitle}>
              Textbook & Course
              <br />
              <span className={styles.heroTitleAccent}>Physical AI & Humanoid Robotics</span>
            </Heading>

            <p className={styles.heroSubtitle}>
              Focus & Theme: <strong>AI Systems in the Physical World — Embodied Intelligence</strong>.
              Hands-on labs, digital twins, perception & control, and VLA (Vision-Language-Action) projects.
            </p>

            <div className={styles.heroButtons}>
              <Link
                className={styles.ctaButton}
                to="/AI-Spec-Driven-Book/docs/Introduction-Embodied-AI-&-Robotics"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className={styles.buttonContent}>
                  <span className={styles.buttonText}>Start Learning</span>
                  <span className={styles.buttonIcon}>→</span>
                </span>
              </Link>

              <Link
                className={styles.secondaryButton}
                to="/overview"
              >
                View Curriculum
              </Link>
            </div>

            {/* Inline stats */}
            <div className={styles.inlineStats} role="list" aria-label="Course stats">
              <div className={styles.stat} role="listitem">
                <div className={styles.statNumber}>350+</div>
                <div className={styles.statLabel}>Pages</div>
              </div>
              <div className={styles.stat} role="listitem">
                <div className={styles.statNumber}>40+</div>
                <div className={styles.statLabel}>Labs</div>
              </div>
              <div className={styles.stat} role="listitem">
                <div className={styles.statNumber}>4</div>
                <div className={styles.statLabel}>Modules</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modules / Features below hero */}
        <div className={styles.heroModules}>
          <h3 className={styles.modulesHeading}>Key Modules</h3>
          <div className={styles.modulesGrid}>
            {[
              "Robotic Nervous System (ROS 2) — Middleware, nodes, topics, services, URDF",
              "Digital Twin (Gazebo & Unity) — Physics simulation, rendering, sensors simulation",
              "AI-Robot Brain (NVIDIA Isaac™) — Perception, navigation, reinforcement learning",
              "Vision-Language-Action (VLA) — LLM integration, voice commands, capstone humanoid project"
            ].map((module, i) => (
              <article key={i} className={styles.moduleCard} aria-labelledby={`mod-${i}`}>
                <div id={`mod-${i}`} className={styles.moduleNumber}>Module {i + 1}</div>
                <p>{module}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Physical AI & Humanoid Robotics"
      description="Textbook and Course on Physical AI, ROS 2, Gazebo, NVIDIA Isaac, and Humanoid Robotics. Hands-on learning and lab experience."
    >
      <HomepageHeader />
    </Layout>
  );
}
