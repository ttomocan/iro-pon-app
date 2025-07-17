import React from 'react';
import Button from './Button';
import { LockIcon } from './icons';

interface HomeScreenProps {
	onSelectGrade: (grade: number) => void;
	onShowColorList: () => void;
	isUnlocked: boolean;
}

// Defines the levels available in the quiz.
const levels = [
	{ grade: 3, title: '3級', description: '公式テキスト掲載の3級範囲（61色）から出題！', isLocked: false },
	{ grade: 2, title: '2級', description: '公式テキスト掲載の2級範囲（63色）から出題！', isLocked: true },
	{ grade: 23, title: '2級（+3級）', description: '公式テキスト掲載の3級・2級の全124色から腕試し！', isLocked: true },
	{ grade: 1, title: '1級', description: '明度・彩度のグラデーション整列に挑戦！', isLocked: true },
];

const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectGrade, onShowColorList, isUnlocked }) => {
	return (
		<div className='w-full max-w-md mx-auto py-4 sm:py-6'>
			<header className='text-center mb-10'>
				<h1
					className='text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text'
					style={{
						backgroundImage: 'linear-gradient(to right, rgb(233 50 50), rgb(225 203 36), rgb(23 221 148), rgb(24 154 219))',
						display: 'inline-block',
					}}
				>
					いろポン！
				</h1>
				<p className='mt-3 text-lg text-slate-600 font-semibold'>色をポンっと当てて、楽しく色彩マスター！</p>
			</header>

			<main className='space-y-5'>
				{levels.map(({ grade, title, description, isLocked }) => {
					const showLock = isLocked && !isUnlocked;
					return (
						<div key={grade} className='bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl border border-slate-200'>
							<div className='p-6'>
								<h2 className='text-2xl font-bold text-slate-900'>{title}</h2>
								<p className='text-slate-600 mb-6'>{description}</p>
								<Button onClick={() => onSelectGrade(grade)}>
									<div className='flex items-center justify-center gap-2'>
										{showLock && <LockIcon className='w-5 h-5' />}
										<span>{title}に挑戦する</span>
									</div>
								</Button>
							</div>
						</div>
					);
				})}

				<div className='pt-4'>
					<Button onClick={onShowColorList} variant='secondary'>
						慣用色名一覧を見る
					</Button>
				</div>
			</main>

			<footer className='text-center mt-12 text-sm text-slate-500'>
				<p>&copy; 2025 いろポン！. All rights reserved.</p>
			</footer>
		</div>
	);
};

export default HomeScreen;
