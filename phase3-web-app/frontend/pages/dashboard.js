import Head from 'next/head';
import styles from '../styles/Dashboard.module.css';

export default function Dashboard() {
  return (
    <div className="container">
      <Head>
        <title>Dashboard - Course Companion FTE</title>
        <meta name="description" content="Learning Dashboard" />
      </Head>

      <main className="main">
        <h1 className="title">Learning Dashboard</h1>
        
        <div className="dashboard-grid">
          <div className="card">
            <h2>Recent Activity</h2>
            <p>Your latest learning activities</p>
          </div>
          
          <div className="card">
            <h2>Current Courses</h2>
            <p>Courses you're currently enrolled in</p>
          </div>
          
          <div className="card">
            <h2>Upcoming Quizzes</h2>
            <p>Quizzes you need to complete</p>
          </div>
          
          <div className="card">
            <h2>Progress Overview</h2>
            <p>Overall progress summary</p>
          </div>
        </div>
      </main>
    </div>
  );
}