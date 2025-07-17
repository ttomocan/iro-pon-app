import React, { useState, useEffect, useCallback } from 'react';
import { ColorData, QuizQuestion } from '../types';
import Modal from './Modal';
import Button from './Button';
import colorsData from '../data/colors.json';

interface QuizScreenProps {
	grade: number;
	onQuizComplete: (score: number, totalQuestions: number) => void;
	onGoHome: () => void;
}

const TOTAL_QUESTIONS = 10;

// Helper function to shuffle an array using the Fisher-Yates algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
	const newArray = [...array];
	for (let i = newArray.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[newArray[i], newArray[j]] = [newArray[j], newArray[i]];
	}
	return newArray;
};

const getGradeTitle = (grade: number): string => {
	switch (grade) {
		case 3:
			return '3級';
		case 2:
			return '2級';
		case 1:
			return '1級';
		case 23:
			return '2級（+3級）';
		default:
			return `${grade}級`;
	}
};

const QuizScreen: React.FC<QuizScreenProps> = ({ grade, onQuizComplete, onGoHome }) => {
	const [allColors, setAllColors] = useState<ColorData[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [questions, setQuestions] = useState<QuizQuestion[]>([]);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [score, setScore] = useState(0);
	const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isCorrect, setIsCorrect] = useState(false);

	// Effect to load color data directly from import
	useEffect(() => {
		try {
			setAllColors(colorsData as ColorData[]);
			setIsLoading(false);
		} catch (error) {
			console.error('Failed to load color data:', error);
			setIsLoading(false);
		}
	}, []);

	// Memoized function to generate quiz questions for the selected grade.
	const generateQuestions = useCallback(() => {
		if (allColors.length === 0) {
			return;
		}

		const getColorsForGrade = (g: number, colors: ColorData[]): ColorData[] => {
			if (g === 23) {
				return colors.filter((color) => color.grade === 2 || color.grade === 3);
			}
			return colors.filter((color) => color.grade === g);
		};

		// Filter colors for the selected grade.
		const gradeColors = getColorsForGrade(grade, allColors);

		// Shuffle and pick up to 10 colors to be the correct answers.
		const shuffledGradeColors = shuffleArray(gradeColors);
		const quizColors = shuffledGradeColors.slice(0, TOTAL_QUESTIONS);

		if (quizColors.length === 0) {
			setQuestions([]);
			return;
		}

		// Create the full question set.
		const newQuestions: QuizQuestion[] = quizColors.map((correctColor) => {
			// Get other colors from the same grade to use as distractors.
			const distractors = shuffledGradeColors
				.filter((c) => c.id !== correctColor.id)
				.slice(0, 3)
				.map((c) => c.color_name);

			// Combine correct answer with distractors and shuffle.
			const options = shuffleArray([...distractors, correctColor.color_name]);

			return {
				correctAnswer: correctColor,
				options: options,
			};
		});

		setQuestions(newQuestions);
		// Reset state for a new quiz
		setCurrentQuestionIndex(0);
		setScore(0);
		setSelectedAnswer(null);
	}, [grade, allColors]);

	// Generate questions when the grade changes or after colors are loaded.
	useEffect(() => {
		if (!isLoading) {
			generateQuestions();
		}
	}, [grade, isLoading, generateQuestions]);

	const handleAnswerClick = (answer: string) => {
		if (selectedAnswer) return; // Prevent multiple clicks

		const currentQuestion = questions[currentQuestionIndex];
		const correct = answer === currentQuestion.correctAnswer.color_name;

		setSelectedAnswer(answer);
		setIsCorrect(correct);
		if (correct) {
			setScore((prevScore) => prevScore + 1);
		}

		// Wait a moment before showing the modal to show selection feedback.
		setTimeout(() => {
			setIsModalOpen(true);
		}, 500);
	};

	const handleNextQuestion = () => {
		setIsModalOpen(false);

		// Defer state reset to allow modal to animate out
		setTimeout(() => {
			if (currentQuestionIndex < questions.length - 1) {
				setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
				setSelectedAnswer(null);
			} else {
				onQuizComplete(score, questions.length);
			}
		}, 300);
	};

	if (isLoading) {
		return <div className='flex justify-center items-center h-screen text-slate-500'>クイズデータを読み込み中...</div>;
	}

	if (questions.length === 0) {
		return (
			<div className='flex flex-col justify-center items-center h-screen text-slate-500 text-center p-4'>
				<h2 className='text-2xl font-bold mb-4'>問題が見つかりません</h2>
				<p>この級のクイズはまだ準備中です。他の級を試してみてください。</p>
			</div>
		);
	}

	const currentQuestion = questions[currentQuestionIndex];
	const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

	return (
		<>
			<div className='w-full max-w-2xl mx-auto py-4 sm:p-6 flex flex-col h-full'>
				<header className='mb-6'>
					<p className='text-lg font-semibold text-cyan-700'>
						{getGradeTitle(grade)} - 問題 {currentQuestionIndex + 1} / {questions.length}
					</p>
					<div className='w-full bg-slate-200 rounded-full h-2.5 mt-2'>
						<div className='bg-cyan-600 h-2.5 rounded-full transition-all duration-500 ease-out' style={{ width: `${progress}%` }}></div>
					</div>
				</header>

				<main className='flex-grow flex flex-col items-center justify-center'>
					<div className='w-full max-w-md bg-white p-4 rounded-2xl shadow-2xl border border-slate-200'>
						<div className='w-full h-48 sm:h-64 rounded-xl mb-8 border-8 border-slate-100 shadow-inner' style={{ backgroundColor: currentQuestion.correctAnswer.color_code }}></div>

						<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
							{currentQuestion.options.map((option, index) => {
								const isSelected = selectedAnswer === option;
								const isCorrectAnswer = option === currentQuestion.correctAnswer.color_name;

								let buttonStyle = 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300';
								if (isSelected) {
									buttonStyle = isCorrect ? 'bg-green-500 text-white border-green-600 ring-4 ring-green-500/30' : 'bg-red-500 text-white border-red-600 ring-4 ring-red-500/30';
								} else if (selectedAnswer && isCorrectAnswer) {
									buttonStyle = 'bg-green-100 text-green-800 border-green-500';
								}

								return (
									<button key={index} onClick={() => handleAnswerClick(option)} disabled={!!selectedAnswer} className={`p-4 rounded-lg text-lg text-center font-bold border-2 transition-all duration-300 transform ${buttonStyle} ${!selectedAnswer ? 'active:scale-95' : 'cursor-not-allowed'}`}>
										{option}
									</button>
								);
							})}
						</div>
					</div>
				</main>

				<footer className='mt-8 text-center'>
					<div className='max-w-xs mx-auto'>
						<Button onClick={onGoHome} variant='secondary'>
							ホームに戻る
						</Button>
					</div>
				</footer>
			</div>

			{isModalOpen && <Modal isOpen={isModalOpen} onClose={handleNextQuestion} isCorrect={isCorrect} colorData={currentQuestion.correctAnswer} />}
		</>
	);
};

export default QuizScreen;
