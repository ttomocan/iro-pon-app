import React from 'react';
import Button from './Button';
import { LockIcon } from './icons';

interface HomeScreenProps {
	onSelectGrade: (grade: number) => void;
	onShowColorList: () => void;
	isUnlocked: boolean;
	onOpenContactForm: () => void;
	onOpenTermsOfService: () => void;
	onShowServiceInfo: () => void;
}

// Defines the levels available in the quiz.
const levels = [
	{
		grade: 3,
		title: '3級',
		description: '公式テキスト掲載の3級範囲（61色）から出題！',
		isLocked: false,
	},
	{
		grade: 2,
		title: '2級',
		description: '公式テキスト掲載の2級範囲（63色）から出題！',
		isLocked: true,
	},
	{
		grade: 23,
		title: '2級（+3級）',
		description: '公式テキスト掲載の3級・2級の全124色から腕試し！',
		isLocked: true,
	},
	{ grade: 1, title: '1級', description: '明度・彩度のグラデーション整列に挑戦！', isLocked: true },
];

const HomeScreen: React.FC<HomeScreenProps> = ({
	onSelectGrade,
	onShowColorList,
	isUnlocked,
	onOpenContactForm,
	onOpenTermsOfService,
	onShowServiceInfo,
}) => {
	const handlePremiumPurchase = () => {
		// プレミアム購入処理をここに実装
		alert('プレミアム機能の購入処理を実装してください');
	};

	return (
		<div className='w-full max-w-2xl mx-auto py-4 sm:p-6'>
			<header className='text-center mb-10'>
				<h1
					className='text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text tracking-wider'
					style={{
						backgroundImage:
							'linear-gradient(to right, rgb(233 50 50), rgb(225 203 36), rgb(23 221 148), rgb(24 154 219))',
						display: 'inline-block',
						fontFamily: '"Mochiy Pop P One", sans-serif',
						fontWeight: 400,
						fontStyle: 'normal',
					}}
				>
					いろポン！
				</h1>
				<p className='mt-3 text-lg text-slate-600 font-semibold'>
					色をポンっと当てて、楽しく色彩マスター！
				</p>
			</header>

			<main className='space-y-5'>
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
					{levels.map(({ grade, title, description, isLocked }) => {
						// 一時的にすべての級を利用可能にする
						const showLock = false; // isLocked && !isUnlocked の代わりに false を設定
						return (
							<div
								key={grade}
								className='bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl border border-slate-200'
							>
								<div className='p-6'>
									<h2 className='text-2xl font-bold text-slate-900 mb-2'>{title}</h2>
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
				</div>

				<div className='pt-4'>
					<Button onClick={onShowColorList} variant='secondary'>
						慣用色名一覧を見る
					</Button>
				</div>
			</main>

			{/* プレミアム機能セクション */}
			<section className='mt-12 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200'>
				<div className='text-center mb-6'>
					<div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4'>
						<span className='text-white text-2xl font-bold'>★</span>
					</div>
					<h2 className='text-3xl font-bold text-slate-900 mb-2'>プレミアム機能</h2>
					<p className='text-slate-600 text-lg'>すべての級を無制限で楽しめる！</p>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<div className='bg-white rounded-xl p-6 shadow-md'>
						<h3 className='text-xl font-bold text-slate-900 mb-4'>プレミアム特典</h3>
						<ul className='space-y-3 text-slate-700'>
							<li className='flex items-center gap-3'>
								<span className='text-green-500 text-lg'>✓</span>
								<span>すべての級（1級・2級・3級）が利用可能</span>
							</li>
							<li className='flex items-center gap-3'>
								<span className='text-green-500 text-lg'>✓</span>
								<span>無制限のクイズチャレンジ</span>
							</li>
							<li className='flex items-center gap-3'>
								<span className='text-green-500 text-lg'>✓</span>
								<span>新機能の利用権</span>
							</li>
						</ul>
					</div>

					<div className='bg-white rounded-xl p-6 shadow-md'>
						<div className='text-center'>
							<div className='mb-4'>
								<span className='text-4xl font-bold text-slate-900'>¥480</span>
							</div>
							<div className='mb-6'>
								<span className='text-sm text-slate-500 line-through'>¥980</span>
								<span className='text-green-600 font-semibold ml-2'>51%OFF</span>
							</div>
							<div className='space-y-3'>
								<Button
									onClick={handlePremiumPurchase}
									className='w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 text-lg'
								>
									プレミアムにアップグレード
								</Button>
								<p className='text-xs text-slate-500'>
									<strong className='text-purple-600'>買い切り</strong>でずっと使える
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			<footer className='text-center mt-12 space-y-4'>
				<div className='space-y-2'>
					<div>
						<button
							onClick={onShowServiceInfo}
							className='text-sm text-slate-500 hover:text-slate-700 underline transition-colors'
						>
							サービス内容
						</button>
					</div>
					<div>
						<button
							onClick={onOpenContactForm}
							className='text-sm text-slate-500 hover:text-slate-700 underline transition-colors'
						>
							お問い合わせ・要望・改善提案
						</button>
					</div>
					<div>
						<button
							onClick={onOpenTermsOfService}
							className='text-sm text-slate-500 hover:text-slate-700 underline transition-colors'
						>
							利用規約
						</button>
					</div>
				</div>
				<p className='text-sm text-slate-500'>&copy; 2025 いろポン！. All rights reserved.</p>
			</footer>
		</div>
	);
};

export default HomeScreen;
