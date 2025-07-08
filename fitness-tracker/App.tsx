import { Activity, Home, Pause, Play, Plus, Square, Target, Timer, TrendingUp, Utensils, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const FitnessTrackerApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [workouts, setWorkouts] = useState([]);
  const [runs, setRuns] = useState([]);
  const [meals, setMeals] = useState([]);
  const [currentWorkout, setCurrentWorkout] = useState<{ type: string; startTime: number } | null>(null);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [showAddWorkout, setShowAddWorkout] = useState(false);
  const [showAddRun, setShowAddRun] = useState(false);
  const [showAddMeal, setShowAddMeal] = useState(false);

  // Timer effect for active workout
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isWorkoutActive && currentWorkout) {
      interval = setInterval(() => {
        setWorkoutTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorkoutActive, currentWorkout]);

  // Format time helper
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate daily stats
  const getDailyStats = () => {
    const today = new Date().toDateString();
    const todayWorkouts = workouts.filter(w => new Date(w.date).toDateString() === today);
    const todayRuns = runs.filter(r => new Date(r.date).toDateString() === today);
    const todayMeals = meals.filter(m => new Date(m.date).toDateString() === today);
    
    const totalCaloriesBurned = [...todayWorkouts, ...todayRuns].reduce((sum, activity) => sum + (activity.caloriesBurned || 0), 0);
    const totalCaloriesConsumed = todayMeals.reduce((sum, meal) => sum + meal.calories, 0);
    const totalDistance = todayRuns.reduce((sum, run) => sum + run.distance, 0);
    const totalWorkoutTime = todayWorkouts.reduce((sum, workout) => sum + workout.duration, 0);

    return {
      caloriesBurned: totalCaloriesBurned,
      caloriesConsumed: totalCaloriesConsumed,
      distance: totalDistance,
      workoutTime: totalWorkoutTime,
      workoutsCount: todayWorkouts.length,
      runsCount: todayRuns.length,
      mealsCount: todayMeals.length
    };
  };

  // Start/Stop workout
  const toggleWorkout = () => {
    if (!currentWorkout) return;
    setIsWorkoutActive(!isWorkoutActive);
  };

  const startNewWorkout = (type: string) => {
    setCurrentWorkout({ type, startTime: Date.now() });
    setWorkoutTimer(0);
    setIsWorkoutActive(true);
    setShowAddWorkout(false);
  };

  const finishWorkout = () => {
    if (!currentWorkout) return;
    
    const workout = {
      id: Date.now(),
      type: currentWorkout.type,
      duration: workoutTimer,
      date: new Date(),
      caloriesBurned: Math.round(workoutTimer * 0.15) // Rough estimate
    };
    
    setWorkouts([...workouts, workout]);
    setCurrentWorkout(null);
    setWorkoutTimer(0);
    setIsWorkoutActive(false);
  };

  // Add run
  const addRun = (runData) => {
    const run = {
      id: Date.now(),
      ...runData,
      date: new Date(),
      caloriesBurned: Math.round(runData.distance * 65) // Rough estimate
    };
    setRuns([...runs, run]);
    setShowAddRun(false);
  };

  // Add meal
  const addMeal = (mealData) => {
    const meal = {
      id: Date.now(),
      ...mealData,
      date: new Date()
    };
    setMeals([...meals, meal]);
    setShowAddMeal(false);
  };

  // Form components
  const RunForm = ({ onSubmit, onCancel }) => {
    const [distance, setDistance] = useState('');
    const [duration, setDuration] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      if (distance && duration) {
        onSubmit({
          distance: parseFloat(distance),
          duration: parseInt(duration)
        });
        setDistance('');
        setDuration('');
      }
    };

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Distance (km)</label>
          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            step="0.1"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="5.0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="30"
          />
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition-colors"
          >
            Save Run
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  const MealForm = ({ onSubmit, onCancel }) => {
    const [food, setFood] = useState('');
    const [mealType, setMealType] = useState('');
    const [calories, setCalories] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      if (food && mealType && calories) {
        onSubmit({
          food: food,
          mealType: mealType,
          calories: parseInt(calories)
        });
        setFood('');
        setMealType('');
        setCalories('');
      }
    };

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Food</label>
          <input
            type="text"
            value={food}
            onChange={(e) => setFood(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Grilled chicken"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Meal Type</label>
          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">Select meal type</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Snack">Snack</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Calories</label>
          <input
            type="number"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="250"
          />
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg transition-colors"
          >
            Add Meal
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  const stats = getDailyStats();

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Today's Progress</h1>
        <p className="text-gray-600">{new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Calories Burned</p>
              <p className="text-2xl font-bold">{stats.caloriesBurned}</p>
            </div>
            <Zap className="w-8 h-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Calories Consumed</p>
              <p className="text-2xl font-bold">{stats.caloriesConsumed}</p>
            </div>
            <Target className="w-8 h-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Distance (km)</p>
              <p className="text-2xl font-bold">{stats.distance.toFixed(1)}</p>
            </div>
            <TrendingUp className="w-8 h-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Workout Time</p>
              <p className="text-2xl font-bold">{formatTime(stats.workoutTime)}</p>
            </div>
            <Timer className="w-8 h-8 opacity-80" />
          </div>
        </div>
      </div>

      {/* Active Workout */}
      {currentWorkout && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-xl mb-6">
          <h3 className="text-xl font-bold mb-4">Active Workout: {currentWorkout.type}</h3>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold">{formatTime(workoutTimer)}</div>
            <div className="flex gap-2">
              <button 
                onClick={toggleWorkout}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 p-3 rounded-full transition-all"
              >
                {isWorkoutActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              <button 
                onClick={finishWorkout}
                className="bg-red-500 hover:bg-red-600 p-3 rounded-full transition-all"
              >
                <Square className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        <button 
          onClick={() => setShowAddWorkout(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-xl transition-all text-center"
        >
          <Plus className="w-8 h-8 mx-auto mb-2" />
          <span className="text-sm">Start Workout</span>
        </button>
        
        <button 
          onClick={() => setShowAddRun(true)}
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-xl transition-all text-center"
        >
          <Plus className="w-8 h-8 mx-auto mb-2" />
          <span className="text-sm">Log Run</span>
        </button>
        
        <button 
          onClick={() => setShowAddMeal(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-xl transition-all text-center"
        >
          <Plus className="w-8 h-8 mx-auto mb-2" />
          <span className="text-sm">Add Meal</span>
        </button>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
        <div className="space-y-3">
          {[...workouts, ...runs, ...meals]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5)
            .map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    {activity.type ? <Activity className="w-5 h-5 text-blue-600" /> : 
                     activity.distance !== undefined ? <TrendingUp className="w-5 h-5 text-green-600" /> :
                     <Utensils className="w-5 h-5 text-orange-600" />}
                  </div>
                  <div>
                    <p className="font-medium">
                      {activity.type || activity.food || `${activity.distance}km Run`}
                    </p>
                    <p className="text-sm text-gray-600">
                      {activity.duration ? formatTime(activity.duration) : 
                       activity.distance ? `${activity.duration}min` :
                       `${activity.calories} calories`}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderWorkouts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Workouts</h2>
        <button 
          onClick={() => setShowAddWorkout(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Workout
        </button>
      </div>

      <div className="grid gap-4">
        {workouts.map((workout) => (
          <div key={workout.id} className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg">{workout.type}</h3>
              <span className="text-sm text-gray-500">
                {new Date(workout.date).toLocaleDateString()}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Duration:</span>
                <span className="ml-2 font-medium">{formatTime(workout.duration)}</span>
              </div>
              <div>
                <span className="text-gray-600">Calories:</span>
                <span className="ml-2 font-medium">{workout.caloriesBurned}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRuns = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Running</h2>
        <button 
          onClick={() => setShowAddRun(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Log Run
        </button>
      </div>

      <div className="grid gap-4">
        {runs.map((run) => (
          <div key={run.id} className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg">Run</h3>
              <span className="text-sm text-gray-500">
                {new Date(run.date).toLocaleDateString()}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Distance:</span>
                <span className="ml-2 font-medium">{run.distance} km</span>
              </div>
              <div>
                <span className="text-gray-600">Duration:</span>
                <span className="ml-2 font-medium">{run.duration} min</span>
              </div>
              <div>
                <span className="text-gray-600">Calories:</span>
                <span className="ml-2 font-medium">{run.caloriesBurned}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNutrition = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Nutrition</h2>
        <button 
          onClick={() => setShowAddMeal(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Meal
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
        <h3 className="font-semibold mb-3">Today's Nutrition</h3>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{stats.caloriesConsumed}</div>
          <div className="text-gray-600">Calories Consumed</div>
        </div>
      </div>

      <div className="grid gap-4">
        {meals.map((meal) => (
          <div key={meal.id} className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg">{meal.food}</h3>
              <span className="text-sm text-gray-500">
                {new Date(meal.date).toLocaleDateString()}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Meal:</span>
                <span className="ml-2 font-medium">{meal.mealType}</span>
              </div>
              <div>
                <span className="text-gray-600">Calories:</span>
                <span className="ml-2 font-medium">{meal.calories}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen">
      {/* Main Content */}
      <div className="p-6 pb-24">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'workouts' && renderWorkouts()}
        {activeTab === 'runs' && renderRuns()}
        {activeTab === 'nutrition' && renderNutrition()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200">
        <div className="flex">
          {[
            { id: 'dashboard', icon: Home, label: 'Home' },
            { id: 'workouts', icon: Activity, label: 'Workouts' },
            { id: 'runs', icon: TrendingUp, label: 'Running' },
            { id: 'nutrition', icon: Utensils, label: 'Nutrition' }
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 py-3 px-2 text-center transition-colors ${
                activeTab === id ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <Icon className="w-6 h-6 mx-auto mb-1" />
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Modals */}
      {showAddWorkout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Start New Workout</h3>
            <div className="space-y-3">
              {['Strength Training', 'Cardio', 'Yoga', 'Pilates', 'HIIT'].map(type => (
                <button
                  key={type}
                  onClick={() => startNewWorkout(type)}
                  className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  {type}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowAddWorkout(false)}
              className="w-full mt-4 p-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showAddRun && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Log Run</h3>
            <RunForm 
              onSubmit={(data) => {
                addRun(data);
              }}
              onCancel={() => setShowAddRun(false)}
            />
          </div>
        </div>
      )}

      {showAddMeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Add Meal</h3>
            <MealForm 
              onSubmit={(data) => {
                addMeal(data);
              }}
              onCancel={() => setShowAddMeal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FitnessTrackerApp;