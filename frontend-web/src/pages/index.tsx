import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

const Home: NextPage = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Course Companion Web App</title>
        <meta name="description" content="A comprehensive learning management system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Transform Your Learning Experience
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Access comprehensive courses, track your progress, and achieve your learning goals with our AI-powered educational platform.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                {isAuthenticated ? (
                  <Link href="/dashboard">
                    <Button size="lg" className="bg-white !text-blue-600 hover:bg-blue-50">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/auth/login">
                      <Button size="lg" variant="secondary" className="text-blue-600">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/register">
                      <Button size="lg">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-md w-full">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 p-4 rounded-lg">
                    <div className="text-3xl mb-2">📚</div>
                    <h3 className="font-semibold">100+ Courses</h3>
                    <p className="text-sm text-blue-100">Expert-led content</p>
                  </div>
                  <div className="bg-white/20 p-4 rounded-lg">
                    <div className="text-3xl mb-2">🏆</div>
                    <h3 className="font-semibold">Achievements</h3>
                    <p className="text-sm text-blue-100">Track your progress</p>
                  </div>
                  <div className="bg-white/20 p-4 rounded-lg">
                    <div className="text-3xl mb-2">🧠</div>
                    <h3 className="font-semibold">AI-Powered</h3>
                    <p className="text-sm text-blue-100">Personalized learning</p>
                  </div>
                  <div className="bg-white/20 p-4 rounded-lg">
                    <div className="text-3xl mb-2">📱</div>
                    <h3 className="font-semibold">Any Device</h3>
                    <p className="text-sm text-blue-100">Learn anywhere</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Learning Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform provides everything you need to succeed in your educational journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Comprehensive Courses</CardTitle>
                <CardDescription>Structured learning paths with rich content</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Access hundreds of courses across various subjects, designed by experts to provide the best learning experience.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Progress Tracking</CardTitle>
                <CardDescription>Visualize your learning journey</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Track your progress with detailed analytics, achievements, and personalized recommendations.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Assistance</CardTitle>
                <CardDescription>Intelligent tutoring for better outcomes</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Get personalized help and explanations tailored to your learning style and pace.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Learning?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have transformed their learning experience with our platform.
          </p>
          <div className="flex justify-center">
            {isAuthenticated ? (
              <Link href="/courses">
                <Button size="lg">Browse Courses</Button>
              </Link>
            ) : (
              <Link href="/auth/register">
                <Button size="lg">Sign Up Free</Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">Course Companion</h3>
              <p className="text-gray-400">Empowering lifelong learners</p>
            </div>
            <div className="flex space-x-6">
              <Link href="/about" className="hover:text-blue-300">About</Link>
              <Link href="/contact" className="hover:text-blue-300">Contact</Link>
              <Link href="/privacy" className="hover:text-blue-300">Privacy</Link>
              <Link href="/terms" className="hover:text-blue-300">Terms</Link>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} Course Companion FTE. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;