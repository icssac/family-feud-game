import React, { useState } from 'react';
import Papa from 'papaparse';
import { Upload, X } from 'lucide-react';

export default function FamilyFeud() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [revealedAnswers, setRevealedAnswers] = useState([]);
  const [currentTeam, setCurrentTeam] = useState(1);
  const [numTeams, setNumTeams] = useState(3);
  const [teamScores, setTeamScores] = useState([]);
  const [teamStrikes, setTeamStrikes] = useState([]);
  const [teamNames, setTeamNames] = useState([]);
  const [roundPoints, setRoundPoints] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [teamCountSelected, setTeamCountSelected] = useState(false);

  const teamColors = [
    { bg: 'bg-red-100', border: 'border-red-500', text: 'text-red-700', textDark: 'text-red-900', btn: 'bg-red-600 hover:bg-red-700', input: 'border-red-300 focus:border-red-500' },
    { bg: 'bg-green-100', border: 'border-green-500', text: 'text-green-700', textDark: 'text-green-900', btn: 'bg-green-600 hover:bg-green-700', input: 'border-green-300 focus:border-green-500' },
    { bg: 'bg-purple-100', border: 'border-purple-500', text: 'text-purple-700', textDark: 'text-purple-900', btn: 'bg-purple-600 hover:bg-purple-700', input: 'border-purple-300 focus:border-purple-500' },
    { bg: 'bg-orange-100', border: 'border-orange-500', text: 'text-orange-700', textDark: 'text-orange-900', btn: 'bg-orange-600 hover:bg-orange-700', input: 'border-orange-300 focus:border-orange-500' },
    { bg: 'bg-pink-100', border: 'border-pink-500', text: 'text-pink-700', textDark: 'text-pink-900', btn: 'bg-pink-600 hover:bg-pink-700', input: 'border-pink-300 focus:border-pink-500' },
    { bg: 'bg-indigo-100', border: 'border-indigo-500', text: 'text-indigo-700', textDark: 'text-indigo-900', btn: 'bg-indigo-600 hover:bg-indigo-700', input: 'border-indigo-300 focus:border-indigo-500' },
    { bg: 'bg-teal-100', border: 'border-teal-500', text: 'text-teal-700', textDark: 'text-teal-900', btn: 'bg-teal-600 hover:bg-teal-700', input: 'border-teal-300 focus:border-teal-500' },
    { bg: 'bg-yellow-100', border: 'border-yellow-500', text: 'text-yellow-700', textDark: 'text-yellow-900', btn: 'bg-yellow-600 hover:bg-yellow-700', input: 'border-yellow-300 focus:border-yellow-500' },
    { bg: 'bg-cyan-100', border: 'border-cyan-500', text: 'text-cyan-700', textDark: 'text-cyan-900', btn: 'bg-cyan-600 hover:bg-cyan-700', input: 'border-cyan-300 focus:border-cyan-500' },
    { bg: 'bg-lime-100', border: 'border-lime-500', text: 'text-lime-700', textDark: 'text-lime-900', btn: 'bg-lime-600 hover:bg-lime-700', input: 'border-lime-300 focus:border-lime-500' }
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (results) => {
        const parsed = results.data
          .filter(row => row.length >= 3 && row[0])
          .map(row => {
            const question = row[0];
            const answers = [];
            for (let i = 1; i < row.length; i += 2) {
              if (row[i] && row[i + 1]) {
                answers.push({
                  text: row[i].trim(),
                  points: parseInt(row[i + 1]) || 0
                });
              }
            }
            return { question, answers };
          });
        setQuestions(parsed);
        setCurrentQuestion(0);
        setRevealedAnswers([]);
        setRoundPoints(0);
        setCurrentTeam(1);
        setGameStarted(false);
        setSetupComplete(false);
        setTeamCountSelected(false);
      },
      skipEmptyLines: true
    });
  };

  const selectTeamCount = (count) => {
    setNumTeams(count);
    const names = Array.from({ length: count }, (_, i) => `Team ${i + 1}`);
    setTeamNames(names);
    setTeamScores(Array(count).fill(0));
    setTeamStrikes(Array(count).fill(0));
    setTeamCountSelected(true);
  };

  const updateTeamName = (index, name) => {
    const newNames = [...teamNames];
    newNames[index] = name;
    setTeamNames(newNames);
  };

  const startGame = () => {
    setSetupComplete(true);
    setGameStarted(true);
    setRevealedAnswers([]);
    setTeamStrikes(Array(numTeams).fill(0));
    setRoundPoints(0);
    setCurrentTeam(1);
  };

  const revealAnswer = (index) => {
    if (!revealedAnswers.includes(index)) {
      setRevealedAnswers([...revealedAnswers, index]);
      const points = questions[currentQuestion].answers[index].points;
      setRoundPoints(roundPoints + points);
    }
  };

  const addStrike = () => {
    const newStrikes = [...teamStrikes];
    if (newStrikes[currentTeam - 1] < 5) {
      newStrikes[currentTeam - 1]++;
      setTeamStrikes(newStrikes);
    }
  };

  const switchTeam = () => {
    setCurrentTeam(currentTeam === numTeams ? 1 : currentTeam + 1);
  };

  const awardPoints = (teamIndex) => {
    const newScores = [...teamScores];
    newScores[teamIndex] += roundPoints;
    setTeamScores(newScores);
    setRoundPoints(0);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setRevealedAnswers([]);
      setTeamStrikes(Array(numTeams).fill(0));
      setRoundPoints(0);
    }
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setRevealedAnswers([]);
    setTeamStrikes(Array(numTeams).fill(0));
    setTeamScores(Array(numTeams).fill(0));
    setRoundPoints(0);
    setCurrentTeam(1);
    setGameStarted(false);
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 flex items-center justify-center p-8">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full">
          <h1 className="text-4xl font-bold text-center mb-6 text-blue-900">
            Family Feud Game
          </h1>
          <div className="mb-6">
            <label className="flex flex-col items-center justify-center w-full h-64 border-4 border-dashed border-blue-300 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition">
              <Upload className="w-16 h-16 text-blue-500 mb-4" />
              <span className="text-xl font-semibold text-blue-700">Upload CSV File</span>
              <span className="text-sm text-gray-500 mt-2">Click to browse</span>
              <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-sm">
            <h3 className="font-bold text-yellow-800 mb-2">CSV Format:</h3>
            <p className="text-yellow-700 mb-2">Each row should contain:</p>
            <code className="block bg-yellow-100 p-2 rounded text-xs">
              Question, Answer1, Points1, Answer2, Points2, Answer3, Points3, ...
            </code>
            <p className="text-yellow-700 mt-2 text-xs">
              Example: "Name a popular pet, Dog, 45, Cat, 38, Fish, 12"
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!teamCountSelected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 flex items-center justify-center p-8">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-3xl w-full">
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-900">How Many Teams?</h2>
          <p className="text-center text-gray-600 mb-8">Select the number of teams playing (2-10)</p>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
            {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(count => (
              <button
                key={count}
                onClick={() => selectTeamCount(count)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-2xl py-8 rounded-lg shadow-lg transition transform hover:scale-105"
              >
                {count}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 flex items-center justify-center p-8">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-4xl w-full">
          <h2 className="text-3xl font-bold mb-2 text-center text-blue-900">Setup Teams</h2>
          <p className="text-center text-gray-600 mb-6">{numTeams} Teams Selected</p>
          <div className="grid md:grid-cols-2 gap-4 mb-8 max-h-96 overflow-y-auto">
            {teamNames.map((name, idx) => (
              <div key={idx}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Team {idx + 1} Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => updateTeamName(idx, e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none text-lg ${teamColors[idx].input}`}
                  placeholder={`Enter Team ${idx + 1} Name`}
                />
              </div>
            ))}
          </div>
          <div className="text-center flex gap-4 justify-center">
            <button
              onClick={() => setTeamCountSelected(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold text-lg px-8 py-4 rounded-lg shadow-lg transition"
            >
              Back
            </button>
            <button
              onClick={startGame}
              className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold text-xl px-12 py-4 rounded-lg shadow-lg transition"
            >
              START GAME
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const gridCols = numTeams <= 4 ? 'md:grid-cols-4' : numTeams <= 6 ? 'md:grid-cols-6' : 'md:grid-cols-5';
  const awardGridCols = numTeams <= 4 ? 'md:grid-cols-4' : numTeams <= 6 ? 'md:grid-cols-6' : 'md:grid-cols-5';

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className={`grid grid-cols-2 ${gridCols} gap-3 mb-6`}>
          {teamNames.map((name, idx) => {
            const color = teamColors[idx];
            return (
              <div
                key={idx}
                className={`rounded-lg shadow-xl p-3 border-4 ${
                  currentTeam === idx + 1 ? `${color.bg} ${color.border}` : 'bg-white border-gray-300'
                }`}
              >
                <h3 className={`text-sm md:text-lg font-bold ${color.text} mb-2 text-center truncate`}>
                  {name}
                </h3>
                <div className={`text-2xl md:text-4xl font-bold text-center mb-2 ${color.textDark}`}>
                  {teamScores[idx]}
                </div>
                <div className="flex gap-1 justify-center flex-wrap">
                  {[0, 1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      className={`w-5 h-5 md:w-7 md:h-7 rounded flex items-center justify-center border-2 ${
                        i < teamStrikes[idx]
                          ? 'bg-red-500 border-red-700'
                          : 'bg-gray-200 border-gray-400'
                      }`}
                    >
                      {i < teamStrikes[idx] && <X className="w-4 h-4 md:w-5 md:h-5 text-white stroke-[3]" />}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <div className={`bg-white rounded-lg shadow-xl p-3 ${numTeams <= 3 ? 'col-span-2' : 'col-span-2 md:col-span-2'}`}>
            <div className="text-center">
              <span className="text-xs md:text-sm font-semibold text-gray-600">ROUND POINTS</span>
              <div className="text-3xl md:text-5xl font-bold text-yellow-600">{roundPoints}</div>
              <div className="mt-2 text-xs md:text-sm font-semibold text-gray-600">
                Q {currentQuestion + 1} / {questions.length}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-800 rounded-t-lg p-4 md:p-6 shadow-xl">
          <h2 className="text-xl md:text-3xl font-bold text-center text-white uppercase">
            {currentQ.question}
          </h2>
        </div>

        <div className="bg-white rounded-b-lg shadow-xl p-4 md:p-6 mb-6">
          <div className="grid gap-3">
            {currentQ.answers.map((answer, idx) => (
              <button
                key={idx}
                onClick={() => revealAnswer(idx)}
                disabled={revealedAnswers.includes(idx)}
                className={`flex items-center justify-between p-3 md:p-4 rounded-lg border-4 transition text-left ${
                  revealedAnswers.includes(idx)
                    ? 'bg-yellow-400 border-yellow-600'
                    : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center gap-2 md:gap-4">
                  <span className="text-xl md:text-2xl font-bold text-blue-900 w-6 md:w-8">
                    {revealedAnswers.includes(idx) ? idx + 1 : ''}
                  </span>
                  <span className={`text-base md:text-xl font-semibold ${
                    revealedAnswers.includes(idx) ? 'text-blue-900' : 'text-transparent'
                  }`}>
                    {revealedAnswers.includes(idx) ? answer.text.toUpperCase() : 'XXXXXXXX'}
                  </span>
                </div>
                {revealedAnswers.includes(idx) && (
                  <span className="text-2xl md:text-3xl font-bold text-blue-900">{answer.points}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 md:gap-4 justify-center mb-4">
          <button
            onClick={addStrike}
            className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 md:px-8 py-2 md:py-3 rounded-lg shadow-lg transition text-sm md:text-base"
          >
            Add Strike
          </button>
          <button
            onClick={switchTeam}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 md:px-8 py-2 md:py-3 rounded-lg shadow-lg transition text-sm md:text-base"
          >
            Switch Team
          </button>
          <button
            onClick={nextQuestion}
            disabled={currentQuestion >= questions.length - 1}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold px-4 md:px-8 py-2 md:py-3 rounded-lg shadow-lg transition text-sm md:text-base"
          >
            Next Question
          </button>
          <button
            onClick={resetGame}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold px-4 md:px-8 py-2 md:py-3 rounded-lg shadow-lg transition text-sm md:text-base"
          >
            New Game
          </button>
        </div>

        <div className={`grid grid-cols-2 ${awardGridCols} gap-2 md:gap-3`}>
          {teamNames.map((name, idx) => {
            const color = teamColors[idx];
            return (
              <button
                key={idx}
                onClick={() => awardPoints(idx)}
                disabled={roundPoints === 0}
                className={`${color.btn} disabled:bg-gray-400 text-white font-bold px-3 md:px-4 py-2 md:py-3 rounded-lg shadow-lg transition text-xs md:text-sm truncate`}
              >
                Award {name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
