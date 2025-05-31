import { useState, useEffect } from 'react';
import { 
  Dumbbell, 
  Clock, 
  Filter, 
  ChevronRight, 
  Heart, 
  ArrowRight,
  Play,
  BookOpen,
  Star,
  Users,
  TrendingUp,
  CheckCircle,
  Target
} from 'lucide-react';
import PageContainer from '../components/PageContainer';

interface Exercise {
  id: string;
  name: string;
  category: 'Stretching' | 'Cardio' | 'Strength' | 'Balance';
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  duration: number;
  description: string;
  image: string;
  rating: number;
  completions: number;
  benefits: string[];
  medicationConsiderations?: string[];
}

interface Article {
  id: string;
  title: string;
  summary: string;
  readTime: number;
  category: string;
  image: string;
  trending?: boolean;
}

const Exercises = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeDifficulty, setActiveDifficulty] = useState<string>('all');
  const [activeDuration, setActiveDuration] = useState<string>('all');
  const [animateCards, setAnimateCards] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(false);

  // Trigger animations on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateCards(true);
      setShowRecommendation(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Sample exercise data
  const exercises: Exercise[] = [
    {
      id: '1',
      name: 'Morning Energizer Stretch',
      category: 'Stretching',
      difficulty: 'Easy',
      duration: 10,
      description: 'Wake up your body with gentle stretches that boost energy and flexibility.',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=200&fit=crop',
      rating: 4.8,
      completions: 1247,
      benefits: ['Improves flexibility', 'Reduces morning stiffness', 'Boosts energy'],
      medicationConsiderations: ['Safe with most blood pressure medications', 'Avoid if experiencing dizziness']
    },
    {
      id: '2',
      name: 'Chair Yoga Flow',
      category: 'Stretching',
      difficulty: 'Easy',
      duration: 15,
      description: 'Accessible yoga poses designed for seated practice, perfect for all mobility levels.',
      image: 'https://images.unsplash.com/photo-1506629905607-d5c93fa7c9a2?w=300&h=200&fit=crop',
      rating: 4.9,
      completions: 892,
      benefits: ['Improves posture', 'Reduces stress', 'Increases mindfulness'],
      medicationConsiderations: ['Suitable for those with mobility issues', 'Safe with most medications']
    },
    {
      id: '3',
      name: 'Gentle Heart Walk',
      category: 'Cardio',
      difficulty: 'Easy',
      duration: 20,
      description: 'A mindful walking routine that strengthens your heart while being gentle on joints.',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
      rating: 4.7,
      completions: 2156,
      benefits: ['Improves cardiovascular health', 'Low impact', 'Mood enhancement'],
      medicationConsiderations: ['Monitor heart rate if on beta blockers', 'Stay hydrated if on diuretics']
    },
    {
      id: '4',
      name: 'Strength Builder Bands',
      category: 'Strength',
      difficulty: 'Moderate',
      duration: 25,
      description: 'Build functional strength using resistance bands with progressive difficulty.',
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&h=200&fit=crop',
      rating: 4.6,
      completions: 634,
      benefits: ['Builds muscle strength', 'Improves bone density', 'Adaptable resistance'],
      medicationConsiderations: ['Avoid if experiencing muscle pain from statins', 'Start with low resistance']
    },
    {
      id: '5',
      name: 'Stability & Balance',
      category: 'Balance',
      difficulty: 'Moderate',
      duration: 15,
      description: 'Essential balance exercises to improve stability and confidence in movement.',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=200&fit=crop',
      rating: 4.8,
      completions: 789,
      benefits: ['Prevents falls', 'Improves coordination', 'Builds confidence'],
      medicationConsiderations: ['Use caution if on medications causing dizziness', 'Have support nearby']
    },
    {
      id: '6',
      name: 'Aqua Fitness Fun',
      category: 'Cardio',
      difficulty: 'Moderate',
      duration: 30,
      description: 'Enjoyable water-based exercises that are easy on joints but great for fitness.',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
      rating: 4.9,
      completions: 421,
      benefits: ['Joint-friendly', 'Full-body workout', 'Therapeutic'],
      medicationConsiderations: ['Excellent for joint issues', 'Safe with most medications']
    }
  ];

  // Health articles data
  const articles: Article[] = [
    {
      id: '1',
      title: 'Exercise & Medication: Finding the Perfect Balance',
      summary: 'Learn how different medications interact with exercise and how to optimize your workout routine.',
      readTime: 5,
      category: 'Health Tips',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=150&fit=crop',
      trending: true
    },
    {
      id: '2',
      title: '10-Minute Morning Routines That Transform Your Day',
      summary: 'Simple, effective morning exercises that boost energy and improve mood throughout the day.',
      readTime: 3,
      category: 'Wellness',
      image: 'https://images.unsplash.com/photo-1506629905607-d5c93fa7c9a2?w=300&h=150&fit=crop'
    },
    {
      id: '3',
      title: 'Chair Exercises: Fitness Without Limits',
      summary: 'Discover how to stay active and build strength even when mobility is limited.',
      readTime: 4,
      category: 'Accessibility',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=150&fit=crop',
      trending: true
    }
  ];

  // Filter exercises
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
      'Stretching': 'bg-blue-50 text-blue-600 border-blue-200',
      'Cardio': 'bg-red-50 text-red-600 border-red-200',
      'Strength': 'bg-green-50 text-green-600 border-green-200',
      'Balance': 'bg-purple-50 text-purple-600 border-purple-200'
    };
    return colors[category] || 'bg-gray-50 text-gray-600 border-gray-200';
  };

  const getDifficultyColor = (difficulty: string): string => {
    const colors: { [key: string]: string } = {
      'Easy': 'bg-emerald-50 text-emerald-600',
      'Moderate': 'bg-amber-50 text-amber-600',
      'Hard': 'bg-red-50 text-red-600'
    };
    return colors[difficulty] || 'bg-gray-50 text-gray-600';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        className={i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  return (
    <PageContainer title="Physical Exercises">
      {/* Header Section */}
      <div className="mb-6 animate-fadeIn">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6 border border-primary/20">
          <h2 className="text-xl font-semibold mb-2 flex items-center text-gray-800">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mr-3">
              <Dumbbell size={20} className="text-primary" />
            </div>
            Your Personalized Exercise Hub
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Discover safe, effective exercises tailored to your health profile and medication needs.
          </p>
          <div className="flex items-center mt-4 space-x-6 text-sm">
            <div className="flex items-center text-green-600">
              <CheckCircle size={16} className="mr-1" />
              <span>Doctor Approved</span>
            </div>
            <div className="flex items-center text-blue-600">
              <Target size={16} className="mr-1" />
              <span>Personalized</span>
            </div>
            <div className="flex items-center text-purple-600">
              <TrendingUp size={16} className="mr-1" />
              <span>Progress Tracking</span>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Recommendation - Now at top */}
      {showRecommendation && (
        <div className="mb-8 animate-slideUp">
          <div className="bg-white border-2 border-primary/20 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center text-gray-800">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-2">
                  <Heart size={16} className="text-primary" />
                </div>
                Today's Smart Pick
              </h3>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                Recommended
              </span>
            </div>
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-4 border border-primary/10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 mb-1">Morning Energizer Stretch</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Perfect for your morning routine - gentle, energizing, and medication-friendly.
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                    <span className="flex items-center">
                      <Clock size={12} className="mr-1" />
                      10 minutes
                    </span>
                    <span className="flex items-center">
                      <Star size={12} className="mr-1 text-yellow-400" />
                      4.8 rating
                    </span>
                  </div>
                </div>
                <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors flex items-center group">
                  <Play size={14} className="mr-1 group-hover:scale-110 transition-transform" />
                  Start Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6 animate-scaleIn">
        <div className="bg-white rounded-lg p-4 text-center border border-gray-100 hover:shadow-sm transition-shadow">
          <div className="text-2xl font-bold text-primary mb-1">12</div>
          <div className="text-xs text-gray-600">Completed</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center border border-gray-100 hover:shadow-sm transition-shadow">
          <div className="text-2xl font-bold text-green-600 mb-1">240</div>
          <div className="text-xs text-gray-600">Minutes</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center border border-gray-100 hover:shadow-sm transition-shadow">
          <div className="text-2xl font-bold text-purple-600 mb-1">7</div>
          <div className="text-xs text-gray-600">Day Streak</div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <Filter size={16} className="text-gray-500 mr-2" />
          <span className="text-sm font-medium text-gray-700">Find Your Perfect Exercise</span>
        </div>

        <div className="space-y-3">
          {/* Category filter */}
          <div>
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Category</p>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {categories.map((category, index) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 transform hover:scale-105 ${
                    activeCategory === category 
                      ? 'bg-primary text-white shadow-md' 
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {category === 'all' ? 'All Categories' : category}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty & Duration in same row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Difficulty</p>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {difficulties.map(difficulty => (
                  <button
                    key={difficulty}
                    onClick={() => setActiveDifficulty(difficulty)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                      activeDifficulty === difficulty 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {difficulty === 'all' ? 'Any' : difficulty}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Duration</p>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {durations.map(duration => (
                  <button
                    key={duration}
                    onClick={() => setActiveDuration(duration)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                      activeDuration === duration 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {duration === 'all' ? 'Any' : `${duration}m`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exercise Cards */}
      <div className="space-y-4 mb-8">
        {filteredExercises.length > 0 ? (
          filteredExercises.map((exercise, index) => (
            <div 
              key={exercise.id}
              className={`bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
                animateCards ? 'animate-fadeIn' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex">
                <div className="w-24 h-24 relative overflow-hidden">
                  <img 
                    src={exercise.image} 
                    alt={exercise.name} 
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(exercise.category)}`}>
                      {exercise.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-4 flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">{exercise.name}</h3>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {renderStars(exercise.rating)}
                          <span className="text-xs text-gray-500 ml-1">{exercise.rating}</span>
                        </div>
                        <span className="text-xs text-gray-400">•</span>
                        <div className="flex items-center text-xs text-gray-500">
                          <Users size={12} className="mr-1" />
                          {exercise.completions.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-gray-600 text-sm mb-1">
                        <Clock size={14} className="mr-1" />
                        <span>{exercise.duration}m</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                        {exercise.difficulty}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{exercise.description}</p>
                  
                  {/* Benefits */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {exercise.benefits.slice(0, 2).map((benefit, idx) => (
                      <span key={idx} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                        {benefit}
                      </span>
                    ))}
                    {exercise.benefits.length > 2 && (
                      <span className="text-xs text-gray-500">+{exercise.benefits.length - 2} more</span>
                    )}
                  </div>
                  
                  {exercise.medicationConsiderations && (
                    <div className="flex items-center text-xs text-primary mb-2">
                      <Heart size={12} className="mr-1" />
                      <span>Medication-friendly</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="border-t border-gray-50 bg-gray-25 px-4 py-3 flex justify-between items-center">
                <button className="text-primary text-sm font-medium flex items-center hover:text-primary-dark transition-colors group">
                  <Play size={14} className="mr-1 group-hover:scale-110 transition-transform" />
                  Start Exercise
                </button>
                <button className="text-gray-500 text-sm flex items-center hover:text-gray-700 transition-colors">
                  View Details
                  <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 animate-fadeIn">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Dumbbell size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No exercises match your filters</h3>
            <p className="text-gray-500 mb-4">Try adjusting your filters to discover more exercises</p>
            <button 
              onClick={() => {
                setActiveCategory('all');
                setActiveDifficulty('all');
                setActiveDuration('all');
              }}
              className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Health Articles Section */}
      <div className="animate-slideUp">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center text-gray-800">
            <BookOpen size={20} className="mr-2 text-primary" />
            Health & Wellness Articles
          </h3>
          <button className="text-primary text-sm font-medium hover:text-primary-dark transition-colors">
            View All
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((article, index) => (
            <div 
              key={article.id}
              className="bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 animate-scaleIn"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="relative">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-32 object-cover"
                />
                {article.trending && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center">
                      <TrendingUp size={10} className="mr-1" />
                      Trending
                    </span>
                  </div>
                )}
                <div className="absolute bottom-2 left-2">
                  <span className="bg-white/90 text-gray-700 text-xs px-2 py-1 rounded-full font-medium">
                    {article.category}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <h4 className="font-medium text-gray-800 mb-2 line-clamp-2">{article.title}</h4>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{article.summary}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock size={12} className="mr-1" />
                    <span>{article.readTime} min read</span>
                  </div>
                  <button className="text-primary text-sm font-medium hover:text-primary-dark transition-colors flex items-center group">
                    Read
                    <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
};

export default Exercises;