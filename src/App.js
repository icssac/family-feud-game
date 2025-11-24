import React, { useState } from 'react';
import Papa from 'papaparse';
import { Upload, X } from 'lucide-react';

export default function FamilyFeud() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [revealedAnswers, setRevealedAnswers] = useState([]);
  const [currentTeam, setCurrentTeam] = useState(1);
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [team3Score, setTeam3Score] = useState(0);
  const [team1Strikes, setTeam1Strikes] = useState(0);
  const [team2Strikes, setTeam2Strikes] = useState(0);
  const [team3Strikes, setTeam3Strikes] = useState(0);
  const [roundPoints, setRoundPoints] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [team1Name, setTeam1Name] = useState('Team 1');
  const [team2Name, setTeam2Name] = useState('Team 2');
  const [team3Name, setTeam3Name] = useState('Team 3');
  const [setupComplete, setSetupComplete] = useState(false);

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
        setTeam1Strikes(0);
        setTeam2Strikes(0);
        setTeam3Strikes(0);
        setTeam1Score(0);
        setTeam2Score(0);
        setTeam3Score(0);
        setRoundPoints(0);
        setCurrentTeam(1);
        setGameStarted(false);
        setSetupComplete(false);
      },
      skipEmptyLines: true
    });
  };

  const startGame = () => {
    setSetupComplete(true);
    setGameStarted(true);
    setRevealedAnswers([]);
    setTeam1Strikes(0);
    setTeam2Strikes(0);
    setTeam3Strikes(0);
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
    if (currentTeam === 1 && team1Strikes < 5) {
      setTeam1Strikes(team1Strikes + 1);
    } else if (currentTeam === 2 && team2Strikes < 5) {
      setTeam2Strikes(team2Strikes + 1);
    } else if (currentTeam === 3 && team3Strikes < 5) {
      setTeam3Strikes(team3Strikes + 1);
    }
  };

  const switchTeam = () => {
    if (currentTeam === 1) setCurrentTeam(2);
    else if (currentTeam === 2) setCurrentTeam(3);
    else setCurrentTeam(1);
  };

  const awardPoints = (team) => {
    if (team === 1) {
      setTeam1Score(team1Score + roundPoints);
    } else if (team === 2) {
      setTeam2Score(team2Score + roundPoints);
    } else {
      setTeam3Score(team3Score + roundPoints);
    }
    setRoundPoints(0);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setRevealedAnswers([]);
      setTeam1Strikes(0);
      setTeam2Strikes(0);
      setTeam3Strikes(0);
      setRoundPoints(0);
    }
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setRevealedAnswers([]);
    setTeam1Strikes(0);
    setTeam2Strikes(0);
    setTeam3Strikes(0);
    setTeam1Score(0);
    setTeam2Score(0);
    setTeam3Score(0);
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

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 flex items-center justify-center p-8">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full">
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-900">Setup Teams</h2>
          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Team 1 Name</label>
              <input
                type="text"
                value={team1Name}
                onChange={(e) => setTeam1Name(e.target.value)}
                className="w-full px-4 py-3 border-2 border-red-300 rounded-lg focus:border-red-500 focus:outline-none text-lg"
                placeholder="Enter Team 1 Name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Team 2 Name</label>
              <input
                type="text"
                value={team2Name}
                onChange={(e) => setTeam2Name(e.target.value)}
                className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none text-lg"
                placeholder="Enter Team 2 Name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Team 3 Name</label>
              <input
                type="text"
                value={team3Name}
                onChange={(e) => setTeam3Name(e.target.value)}
                className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:border-purple-500 focus:outline-none text-lg"
                placeholder="Enter Team 3 Name"
              />
            </div>
          </div>
          <div className="text-center">
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <div className={`rounded-lg shadow-xl p-6 border-4 ${
            currentTeam === 1 ? 'bg-red-100 border-red-500' : 'bg-white border-gray-300'
          }`}>
            <h3 className="text-2xl font-bold text-red-700 mb-3 text-center">{team1Name}</h3>
            <div className="text-5xl font-bold text-center mb-4 text-red-900">{team1Score}</div>
            <div className="flex gap-1 justify-center">
              {[0, 1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded flex items-center justify-center border-2 ${
                    i < team1Strikes
                      ? 'bg-red-500 border-red-700'
                      : 'bg-gray-200 border-gray-400'
                  }`}
                >
                  {i < team1Strikes && <X className="w-6 h-6 text-white stroke-[3]" />}
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-lg shadow-xl p-6 border-4 ${
            currentTeam === 2 ? 'bg-green-100 border-green-500' : 'bg-white border-gray-300'
          }`}>
            <h3 className="text-2xl font-bold text-green-700 mb-3 text-center">{team2Name}</h3>
            <div className="text-5xl font-bold text-center mb-4 text-green-900">{team2Score}</div>
            <div className="flex gap-1 justify-center">
              {[0, 1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded flex items-center justify-center border-2 ${
                    i < team2Strikes
                      ? 'bg-red-500 border-red-700'
                      : 'bg-gray-200 border-gray-400'
                  }`}
                >
                  {i < team2Strikes && <X className="w-6 h-6 text-white stroke-[3]" />}
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-lg shadow-xl p-6 border-4 ${
            currentTeam === 3 ? 'bg-purple-100 border-purple-500' : 'bg-white border-gray-300'
          }`}>
            <h3 className="text-2xl font-bold text-purple-700 mb-3 text-center">{team3Name}</h3>
            <div className="text-5xl font-bold text-center mb-4 text-purple-900">{team3Score}</div>
            <div className="flex gap-1 justify-center">
              {[0, 1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded flex items-center justify-center border-2 ${
                    i < team3Strikes
                      ? 'bg-red-500 border-red-700'
                      : 'bg-gray-200 border-gray-400'
                  }`}
                >
                  {i < team3Strikes && <X className="w-6 h-6 text-white stroke-[3]" />}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-6">
            <div className="text-center">
              <span className="text-sm font-semibold text-gray-600">ROUND POINTS</span>
              <div className="text-5xl font-bold text-yellow-600">{roundPoints}</div>
              <div className="mt-4 text-sm font-semibold text-gray-600">
                Q {currentQuestion + 1} / {questions.length}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-800 rounded-t-lg p-6 shadow-xl">
          <h2 className="text-3xl font-bold text-center text-white uppercase">
            {currentQ.question}
          </h2>
        </div>

        <div className="bg-white rounded-b-lg shadow-xl p-6 mb-6">
          <div className="grid gap-3">
            {currentQ.answers.map((answer, idx) => (
              <button
                key={idx}
                onClick={() => revealAnswer(idx)}
                disabled={revealedAnswers.includes(idx)}
                className={`flex items-center justify-between p-4 rounded-lg border-4 transition text-left ${
                  revealedAnswers.includes(idx)
                    ? 'bg-yellow-400 border-yellow-600'
                    : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-blue-900 w-8">
                    {revealedAnswers.includes(idx) ? idx + 1 : ''}
                  </span>
                  <span className={`text-xl font-semibold ${
                    revealedAnswers.includes(idx) ? 'text-blue-900' : 'text-transparent'
                  }`}>
                    {revealedAnswers.includes(idx) ? answer.text.toUpperCase() : 'XXXXXXXX'}
                  </span>
                </div>
                {revealedAnswers.includes(idx) && (
                  <span className="text-3xl font-bold text-blue-900">{answer.points}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={addStrike}
            className="bg-red-500 hover:bg-red-600 text-white font-bold px-8 py-3 rounded-lg shadow-lg transition"
          >
            Add Strike
          </button>
          <button
            onClick={switchTeam}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-lg shadow-lg transition"
          >
            Switch Team
          </button>
          <button
            onClick={() => awardPoints(1)}
            disabled={roundPoints === 0}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition"
          >
            Award Team 1
          </button>
          <button
            onClick={() => awardPoints(2)}
            disabled={roundPoints === 0}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition"
          >
            Award Team 2
          </button>
          <button
            onClick={() => awardPoints(3)}
            disabled={roundPoints === 0}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition"
          >
            Award Team 3
          </button>
          <button
            onClick={nextQuestion}
            disabled={currentQuestion >= questions.length - 1}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold px-8 py-3 rounded-lg shadow-lg transition"
          >
            Next Question
          </button>
          <button
            onClick={resetGame}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold px-8 py-3 rounded-lg shadow-lg transition"
          >
            New Game
          </button>
        </div>
      </div>
    </div>
  );
}