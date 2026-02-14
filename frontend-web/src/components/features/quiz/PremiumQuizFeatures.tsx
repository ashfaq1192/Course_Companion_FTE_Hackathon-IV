import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

interface PremiumQuizFeaturesProps {
  quizId: string;
  onUpgradeClick?: () => void;
}

export const PremiumQuizFeatures: React.FC<PremiumQuizFeaturesProps> = ({ 
  quizId, 
  onUpgradeClick 
}) => {
  const { user } = useAuth();

  // Check if user has premium access
  const hasPremiumAccess = user?.subscriptionType === 'premium' || user?.subscriptionType === 'admin';

  return (
    <div className="space-y-6">
      {!hasPremiumAccess && (
        <Card className="border-2 border-yellow-400 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="mr-2">⭐</span> Premium Quiz Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Unlock advanced quiz features with a premium subscription:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Detailed AI-powered feedback on your answers</li>
              <li>Advanced explanations for complex concepts</li>
              <li>Personalized learning recommendations</li>
              <li>AI tutor assistance for difficult questions</li>
            </ul>
            <Button 
              onClick={onUpgradeClick || (() => window.location.href = '/pricing')}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
            >
              Upgrade to Premium
            </Button>
          </CardContent>
        </Card>
      )}

      {hasPremiumAccess && (
        <Card className="border-2 border-blue-400 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="mr-2">🤖</span> AI-Powered Quiz Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              You have access to advanced AI features for this quiz:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Detailed AI-powered feedback on your answers</li>
              <li>Advanced explanations for complex concepts</li>
              <li>Personalized learning recommendations</li>
              <li>AI tutor assistance for difficult questions</li>
            </ul>
            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1">
                Request AI Feedback
              </Button>
              <Button variant="outline" className="flex-1">
                Get Learning Tips
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feature Comparison Card */}
      <Card>
        <CardHeader>
          <CardTitle>Quiz Features Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-3 text-gray-700">Free Features</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Basic quiz taking</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Immediate score results</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Question review after quiz</span>
                </li>
                <li className="flex items-center opacity-50">
                  <span className="text-gray-400 mr-2">○</span>
                  <span>AI-powered feedback</span>
                </li>
                <li className="flex items-center opacity-50">
                  <span className="text-gray-400 mr-2">○</span>
                  <span>Detailed explanations</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3 text-blue-700">Premium Features</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">★</span>
                  <span>All free features</span>
                </li>
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">★</span>
                  <span>AI-powered feedback</span>
                </li>
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">★</span>
                  <span>Detailed explanations</span>
                </li>
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">★</span>
                  <span>Personalized recommendations</span>
                </li>
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">★</span>
                  <span>AI tutor assistance</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};