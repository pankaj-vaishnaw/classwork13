import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuizApp = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(5);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);

  useEffect(() => {
    axios.get('https://opentdb.com/api_category.php').then((response) => {
      setCategories(response.data.trivia_categories);
    });
  }, []);

  const fetchQuestions = async () => {
    const apiUrl = 'https://opentdb.com/api.php';
    try {
      const response = await axios.get(apiUrl, {
        params: {
          amount: numQuestions,
          category: selectedCategory,
          difficulty: selectedDifficulty,
          type: 'multiple',
        },
      });
      setQuestions(response.data.results);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  useEffect(() => {
    if (selectedCategory && selectedDifficulty) {
      fetchQuestions();
    }
  }, [selectedCategory, selectedDifficulty, numQuestions]);

  useEffect(() => {
    let interval;

    if (currentQuestion < questions.length && selectedOption === null) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    return () => {
      clearInterval(interval);
      setTimer(5);
    };
  }, [currentQuestion, selectedOption]);

  useEffect(() => {
    if (timer === 0) {
      handleNextQuestion();
    }
  }, [timer]);

  const handleOptionClick = (option) => {
    if (selectedOption === null) {
      setSelectedOption(option);

      if (option === questions[currentQuestion]?.correct_answer) {
        setScore(score + 1);
      }
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setCurrentQuestion(currentQuestion + 1);
    setTimer(5);
  };

 
const shuffleOptions = () => {
    const options =
      questions[currentQuestion]?.incorrect_answers &&
      questions[currentQuestion]?.correct_answer
        ? [
            ...questions[currentQuestion]?.incorrect_answers,
            questions[currentQuestion]?.correct_answer,
          ]
        : [];
    return options ? options.sort(() => Math.random() - 0.5) : [];
  };
  return (
    <div className="quiz-app bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="question-container bg-white p-8 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-4" dangerouslySetInnerHTML={{ __html: questions[currentQuestion]?.question }} />
        <div className="timer mb-4">{timer}s</div>
        <div className="options grid grid-cols-2 gap-4">
          {shuffleOptions().map((option, index) => (
            <button
              key={index}
              className={`option p-4 rounded border border-gray-300 bg-white hover:bg-gray-200 focus:outline-none ${selectedOption === option ? 'selected' : ''}`}
              onClick={() => handleOptionClick(option)}
              dangerouslySetInnerHTML={{ __html: option }}
            />
          ))}
        </div>
        {selectedOption !== null && (
          <button className="next-button mt-4 p-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 focus:outline-none" onClick={handleNextQuestion}>
            Next Question
          </button>
        )}
      </div>
      <div className="settings-container bg-white p-8 rounded shadow-md ml-8">
        <h2 className="text-xl font-semibold mb-4">Quiz Settings</h2>
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Select Category
          </label>
          <select
            id="category"
            name="category"
            className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Any Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
            Select Difficulty
          </label>
          <select
            id="difficulty"
            name="difficulty"
            className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            onChange={(e) => setSelectedDifficulty(e.target.value)}
          >
            <option value="">Any Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="numQuestions" className="block text-sm font-medium text-gray-700">
            Number of Questions
          </label>
          <input
            type="number"
            id="numQuestions"
            name="numQuestions"
            min="1"
            max="20"
            value={numQuestions}
            onChange={(e) => setNumQuestions(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>
        <button
          className="start-quiz-button p-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 focus:outline-none"
          onClick={fetchQuestions}
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizApp;
