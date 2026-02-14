import Head from 'next/head';
import styles from '../styles/Courses.module.css';

export default function Courses() {
  const courses = [
    { id: 1, title: 'Introduction to AI Agent Development', progress: 75, duration: '4 weeks' },
    { id: 2, title: 'Cloud-Native Python Applications', progress: 40, duration: '6 weeks' },
    { id: 3, title: 'Generative AI Fundamentals', progress: 100, duration: '5 weeks' },
    { id: 4, title: 'Modern Python with Typing', progress: 20, duration: '3 weeks' },
  ];

  return (
    <div className="container">
      <Head>
        <title>Courses - Course Companion FTE</title>
        <meta name="description" content="Available Courses" />
      </Head>

      <main className="main">
        <h1 className="title">Available Courses</h1>
        
        <div className="courses-list">
          {courses.map(course => (
            <div key={course.id} className="course-card">
              <h2>{course.title}</h2>
              <p>Duration: {course.duration}</p>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
              <p>Progress: {course.progress}%</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}