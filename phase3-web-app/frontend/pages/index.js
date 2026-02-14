import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Course Companion FTE</title>
        <meta name="description" content="Digital Full-Time Equivalent Educational Tutor" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="#">Course Companion FTE</a>
        </h1>

        <p className={styles.description}>
          Your Digital Full-Time Equivalent Educational Tutor
        </p>

        <div className={styles.grid}>
          <Link href="/dashboard" className={styles.card}>
            <h2>Dashboard &rarr;</h2>
            <p>View your learning progress and achievements</p>
          </Link>

          <Link href="/courses" className={styles.card}>
            <h2>Courses &rarr;</h2>
            <p>Access all available courses and materials</p>
          </Link>

          <Link href="/progress" className={styles.card}>
            <h2>Progress &rarr;</h2>
            <p>Track your learning journey and milestones</p>
          </Link>

          <Link href="/quiz" className={styles.card}>
            <h2>Quizzes &rarr;</h2>
            <p>Test your knowledge with interactive assessments</p>
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>Course Companion FTE - Digital Education for Everyone</p>
      </footer>
    </div>
  );
}