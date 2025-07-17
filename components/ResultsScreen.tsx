import React from 'react';
import Button from './Button';

interface ResultsScreenProps {
	score: number;
	totalQuestions: number;
	grade: number;
	onRestart: () => void;
	onGoHome: () => void;
}

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

const ResultsScreen: React.FC<ResultsScreenProps> = ({ score, totalQuestions, grade, onRestart, onGoHome }) => {
	const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

	let message = '';
	let emoji = '';
	if (percentage === 100) {
		message = '素晴らしい！全問正解です！';
		emoji = '🎉';
	} else if (percentage >= 80) {
		message = 'お見事！あともう一息！';
		emoji = '👍';
	} else if (percentage >= 50) {
		message = '良い調子！繰り返し挑戦しよう！';
		emoji = '😊';
	} else {
		message = 'お疲れ様でした！次回がんばろう！';
		emoji = '💪';
	}

	return (
		<div className='w-full max-w-md mx-auto py-4 sm:p-6 text-center'>
			<div className='bg-white rounded-2xl shadow-xl p-8 border border-slate-200'>
				<header className='mb-6'>
					<h1 className='text-3xl font-bold text-slate-900'>結果発表 ({getGradeTitle(grade)})</h1>
				</header>

				<main className='mb-8'>
					<div className='text-8xl mb-4'>{emoji}</div>
					<p className='text-2xl text-slate-600 mb-6'>{message}</p>
					<p className='text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-teal-500'>
						{score} / {totalQuestions}
					</p>
					<p className='text-2xl font-bold text-slate-500 mt-2'>正解率: {percentage}%</p>
				</main>

				<footer className='space-y-4'>
					<Button onClick={onRestart} variant='primary'>
						もう一度挑戦する
					</Button>
					<Button onClick={onGoHome} variant='secondary'>
						ホームに戻る
					</Button>
				</footer>
			</div>
		</div>
	);
};

export default ResultsScreen;
