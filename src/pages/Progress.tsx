import PageContainer from '../components/PageContainer';
import { progressData } from '../data/mockData';

const Progress = () => {
  return (
    <PageContainer title="Medication Progress">
      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          Track your medication adherence and see your progress over time.
        </p>
        
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="card p-4 flex flex-col items-center justify-center text-center">
            <div className="text-2xl font-bold text-primary mb-1">{progressData.weekAdherence}%</div>
            <div className="text-xs text-gray-500">This Week</div>
          </div>
          
          <div className="card p-4 flex flex-col items-center justify-center text-center">
            <div className="text-2xl font-bold text-primary mb-1">{progressData.currentStreak}</div>
            <div className="text-xs text-gray-500">Current Streak</div>
          </div>
          
          <div className="card p-4 flex flex-col items-center justify-center text-center">
            <div className="text-2xl font-bold text-primary mb-1">{progressData.perfectWeeks}</div>
            <div className="text-xs text-gray-500">Perfect Weeks</div>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-3">Weekly Adherence</h2>
          <div className="card p-4">
            <div className="grid grid-cols-7 gap-1">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="text-xs text-gray-500 mb-1">{day}</div>
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      index < 5 ? 'bg-success text-white' : 
                      index === 5 ? 'bg-warning text-white' : 
                      'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {index < 6 ? (index < 5 ? '100%' : '67%') : '-'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-3">Medication Breakdown</h2>
          {progressData.medications.map((med, index) => (
            <div key={index} className="card p-4 mb-3">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">{med.name}</h3>
                <div className="text-sm font-medium">{med.adherence}%</div>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${med.adherence}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-3">Time of Day Breakdown</h2>
          <div className="grid grid-cols-3 gap-3">
            {progressData.timeOfDay.map((time, index) => (
              <div key={index} className="card p-4">
                <div className="text-center mb-2">
                  <h3 className="font-medium">{time.period}</h3>
                  <div className="text-xl font-bold text-primary">{time.adherence}%</div>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${time.adherence}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="card p-4 border-l-4 border-primary">
          <h2 className="font-medium mb-2">Personalized Insights</h2>
          <p className="text-sm text-gray-600">
            You're doing great with your morning medications! Try setting an alarm to help remember your evening dose of Metformin.
          </p>
        </div>
      </div>
    </PageContainer>
  );
};

export default Progress;
