import { useState } from 'react';
import { Dumbbell, Clock, Filter, ChevronRight, Heart, ArrowRight } from 'lucide-react';
import PageContainer from '../components/PageContainer';

interface Exercise {
  id: string;
  name: string;
  category: 'Stretching' | 'Cardio' | 'Strength' | 'Balance';
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  duration: number; // in minutes
  description: string;
  image: string;
  medicationConsiderations?: string[];
}

const Exercises = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeDifficulty, setActiveDifficulty] = useState<string>('all');
  const [activeDuration, setActiveDuration] = useState<string>('all');

  // Sample exercise data
  const exercises: Exercise[] = [
    {
      id: '1',
      name: 'Gentle Morning Stretch',
      category: 'Stretching',
      difficulty: 'Easy',
      duration: 10,
      description: 'A gentle full-body stretch routine perfect for starting your day.',
      image: 'https://via.placeholder.com/150',
      medicationConsiderations: ['Safe with most blood pressure medications', 'Avoid if experiencing dizziness']
    },
    {
      id: '2',
      name: 'Chair Yoga',
      category: 'Stretching',
      difficulty: 'Easy',
      duration: 15,
      description: 'Yoga poses modified to be performed while seated in a chair.',
      image: 'https://via.placeholder.com/150',
      medicationConsiderations: ['Suitable for those with mobility issues', 'Safe with most medications']
    },
    {
      id: '3',
      name: 'Light Walking',
      category: 'Cardio',
      difficulty: 'Easy',
      duration: 20,
      description: 'A simple walking routine to improve cardiovascular health.',
      image: 'https://via.placeholder.com/150',
      medicationConsiderations: ['Monitor heart rate if on beta blockers', 'Stay hydrated if on diuretics']
    },
    {
      id: '4',
      name: 'Resistance Band Workout',
      category: 'Strength',
      difficulty: 'Moderate',
      duration: 25,
      description: 'Build strength using resistance bands with adjustable tension.',
      image: 'https://via.placeholder.com/150',
      medicationConsiderations: ['Avoid if experiencing muscle pain from statins', 'Start with low resistance']
    },
    {
      id: '5',
      name: 'Balance Training',
      category: 'Balance',
      difficulty: 'Moderate',
      duration: 15,
      description: 'Exercises to improve stability and prevent falls.',
      image: 'https://via.placeholder.com/150',
      medicationConsiderations: ['Use caution if on medications causing dizziness', 'Have support nearby']
    },
    {
      id: '6',
      name: 'Water Aerobics',
      category: 'Cardio',
      difficulty: 'Moderate',
      duration: 30,
      description: 'Low-impact cardio exercises performed in water.',
      image: 'https://via.placeholder.com/150',
      medicationConsiderations: ['Excellent for joint issues', 'Safe with most medications']
    }
  ];

  // Filter exercises based on selected filters
  const filteredExercises = exercises.filter(exercise => {
    if (activeCategory !== 'all' && exercise.category !== activeCategory) return false;
    if (activeDifficulty !== 'all' && exercise.difficulty !== activeDifficulty) return false;
    if (activeDuration !== 'all') {
      const durationRange = activeDuration.split('-').map(Number);
      if (durationRange.length === 2) {
        if (exercise.duration < durationRange[0] || exercise.duration > durationRange[1]) return false;
      }
    }
    return true;
  });

  const categories = ['all', 'Stretching', 'Cardio', 'Strength', 'Balance'];
  const difficulties = ['all', 'Easy', 'Moderate', 'Hard'];
  const durations = ['all', '5-15', '15-30', '30-60'];

  const getCategoryColor = (category: string): string => {
    const colors: { [key: string]: string } = {
      'Stretching': 'bg-blue-100 text-blue-600',
      'Cardio': 'bg-red-100 text-red-600',
      'Strength': 'bg-green-100 text-green-600',
      'Balance': 'bg-purple-100 text-purple-600'
    };
    return colors[category] || 'bg-gray-100 text-gray-600';
  };

  const getDifficultyColor = (difficulty: string): string => {
    const colors: { [key: string]: string } = {
      'Easy': 'bg-green-100 text-green-600',
      'Moderate': 'bg-yellow-100 text-yellow-600',
      'Hard': 'bg-red-100 text-red-600'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-600';
  };

  return (
    <PageContainer title="Physical Exercises">
      <div className="mb-4">
        <h2 className="text-lg font-medium mb-2 flex items-center">
          <Dumbbell size={20} className="mr-2 text-primary" />
          Recommended Exercises
        </h2>
        <p className="text-sm text-gray-600">
          Personalized exercises based on your medications and health profile.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex space-x-2 items-center mb-2">
          <Filter size={16} className="text-gray-500" />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        {/* Category filter */}
        <div className="mb-2">
          <p className="text-xs text-gray-500 mb-1">Category</p>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                  activeCategory === category 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All Categories' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty filter */}
        <div className="mb-2">
          <p className="text-xs text-gray-500 mb-1">Difficulty</p>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {difficulties.map(difficulty => (
              <button
                key={difficulty}
                onClick={() => setActiveDifficulty(difficulty)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                  activeDifficulty === difficulty 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {difficulty === 'all' ? 'All Difficulties' : difficulty}
              </button>
            ))}
          </div>
        </div>

        {/* Duration filter */}
        <div>
          <p className="text-xs text-gray-500 mb-1">Duration (minutes)</p>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {durations.map(duration => (
              <button
                key={duration}
                onClick={() => setActiveDuration(duration)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                  activeDuration === duration 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {duration === 'all' ? 'Any Duration' : `${duration} min`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Exercise list */}
      <div className="space-y-4">
        {filteredExercises.length > 0 ? (
          filteredExercises.map(exercise => (
            <div 
              key={exercise.id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="flex">
                <div className="w-24 h-24 bg-gray-200 flex-shrink-0">
                  <img 
                    src={exercise.image} 
                    alt={exercise.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{exercise.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${getCategoryColor(exercise.category)}`}>
                          {exercise.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${getDifficultyColor(exercise.difficulty)}`}>
                          {exercise.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-500 text-xs">
                      <Clock size={14} className="mr-1" />
                      <span>{exercise.duration} min</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{exercise.description}</p>
                  
                  {exercise.medicationConsiderations && (
                    <div className="mt-2">
                      <div className="flex items-center text-xs text-primary">
                        <Heart size={12} className="mr-1" />
                        <span>Medication considerations</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="border-t border-gray-100 bg-gray-50 p-2 flex justify-end">
                <button className="text-primary text-sm font-medium flex items-center">
                  View Details
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Dumbbell size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500 mb-2">No exercises match your filters</p>
            <button 
              onClick={() => {
                setActiveCategory('all');
                setActiveDifficulty('all');
                setActiveDuration('all');
              }}
              className="text-primary font-medium"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Today's recommendation */}
      <div className="mt-8 bg-primary/10 rounded-lg p-4">
        <h3 className="font-medium mb-2 flex items-center">
          <Heart size={18} className="mr-2 text-primary" />
          Today's Recommendation
        </h3>
        <p className="text-sm text-gray-700 mb-3">
          Based on your medication schedule and health status, we recommend:
        </p>
        <div className="bg-white rounded-lg p-3 border border-primary/20">
          <h4 className="font-medium">Gentle Morning Stretch</h4>
          <p className="text-sm text-gray-600 mt-1">
            Start your day with this 10-minute routine to improve flexibility and reduce stiffness.
          </p>
          <button className="mt-2 text-primary text-sm font-medium flex items-center">
            Start Now
            <ArrowRight size={16} className="ml-1" />
          </button>
        </div>
      </div>
    </PageContainer>
  );
};

export default Exercises;
