import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useApiQuery } from '@/hooks/useApiQuery';

interface Achievement {
  id: string;
  name: string;
  description: string;
  earnedDate: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AchievementCategory {
  id: string;
  name: string;
  achievements: Achievement[];
}

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common': return 'bg-gray-200';
    case 'rare': return 'bg-blue-200';
    case 'epic': return 'bg-purple-200';
    case 'legendary': return 'bg-yellow-200';
    default: return 'bg-gray-200';
  }
};

export const AchievementDisplay: React.FC = () => {
  const { data: achievements, isLoading, error } = useApiQuery<AchievementCategory[]>(
    ['user-achievements'],
    '/achievements/user' // Hypothetical endpoint
  );

  if (isLoading) {
    return <div>Loading achievements...</div>;
  }

  if (error) {
    return <div>Error loading achievements: {(error as Error).message}</div>;
  }

  if (!achievements || achievements.length === 0) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No achievements yet. Start learning to earn badges!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-6">Achievements</h2>
      
      {achievements.map((category) => (
        <Card key={category.id} className="mb-6">
          <CardHeader>
            <CardTitle>{category.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {category.achievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className={`p-4 rounded-lg border-2 ${getRarityColor(achievement.rarity)} flex flex-col items-center text-center`}
                >
                  <div className="text-4xl mb-2">{achievement.icon}</div>
                  <h3 className="font-semibold">{achievement.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Earned: {new Date(achievement.earnedDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* Stats Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Achievement Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {achievements.reduce((sum, cat) => sum + cat.achievements.length, 0)}
              </div>
              <div className="text-sm text-gray-500">Total Earned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {achievements.flatMap(cat => cat.achievements).filter(a => a.rarity === 'common').length}
              </div>
              <div className="text-sm text-gray-500">Common</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {achievements.flatMap(cat => cat.achievements).filter(a => a.rarity === 'rare').length}
              </div>
              <div className="text-sm text-gray-500">Rare</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {achievements.flatMap(cat => cat.achievements).filter(a => a.rarity === 'epic' || a.rarity === 'legendary').length}
              </div>
              <div className="text-sm text-gray-500">Epic/Legendary</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};