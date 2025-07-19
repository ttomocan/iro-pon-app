import React from 'react';
import Button from './Button';

interface ServiceInfoProps {
	onGoHome: () => void;
	onOpenContactForm: () => void;
}

const ServiceInfo: React.FC<ServiceInfoProps> = ({ onGoHome, onOpenContactForm }) => {
	return (
		<div className='w-full max-w-4xl mx-auto py-4 sm:p-6'>
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
				<p className='mt-3 text-lg text-slate-600 font-semibold'>サービス内容</p>
			</header>

			<main className='space-y-12'>
				{/* サービス概要セクション */}
				<section className='bg-white rounded-xl shadow-lg p-6 border border-slate-200'>
					<h2 className='text-2xl font-bold text-slate-900 mb-4'>サービス概要</h2>
					<div className='space-y-4 text-slate-700'>
						<p>
							「いろポン！」は、色彩検定の学習をサポートするためのクイズアプリです。
							慣用色名や色彩の基礎知識を楽しく学べるよう設計されており、
							色彩検定の3級、2級、1級に対応した様々な問題に挑戦できます。
						</p>
						<p>
							色彩の世界を楽しみながら学べるように、直感的な操作と視覚的なフィードバックを重視しています。
							初心者から上級者まで、自分のレベルに合わせて学習を進めることができます。
						</p>
					</div>
				</section>

				{/* 料金プラン比較表 */}
				<section className='bg-white rounded-xl shadow-lg p-6 border border-slate-200'>
					<h2 className='text-2xl font-bold text-slate-900 mb-6'>料金プラン</h2>

					<div className='overflow-x-auto'>
						<table className='min-w-full divide-y divide-slate-200'>
							<thead>
								<tr>
									<th className='px-6 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'>
										機能
									</th>
									<th className='px-6 py-3 bg-slate-50 text-center text-xs font-medium text-slate-500 uppercase tracking-wider'>
										無料プラン
									</th>
									<th className='px-6 py-3 bg-purple-50 text-center text-xs font-medium text-purple-600 uppercase tracking-wider'>
										プレミアムプラン
										<br />
										¥480（買い切り）
									</th>
								</tr>
							</thead>
							<tbody className='bg-white divide-y divide-slate-200'>
								<tr>
									<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900'>
										3級クイズ
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-center text-sm text-slate-700'>
										<span className='text-green-500 text-lg'>✓</span>
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-center text-sm text-slate-700 bg-purple-50'>
										<span className='text-green-500 text-lg'>✓</span>
									</td>
								</tr>
								<tr>
									<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900'>
										2級クイズ
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-center text-sm text-slate-700'>
										<span className='text-red-500 text-lg'>✕</span>
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-center text-sm text-slate-700 bg-purple-50'>
										<span className='text-green-500 text-lg'>✓</span>
									</td>
								</tr>
								<tr>
									<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900'>
										1級クイズ（グラデーション整列）
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-center text-sm text-slate-700'>
										<span className='text-red-500 text-lg'>✕</span>
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-center text-sm text-slate-700 bg-purple-50'>
										<span className='text-green-500 text-lg'>✓</span>
									</td>
								</tr>
								<tr>
									<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900'>
										慣用色名一覧
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-center text-sm text-slate-700'>
										<span className='text-green-500 text-lg'>✓</span>
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-center text-sm text-slate-700 bg-purple-50'>
										<span className='text-green-500 text-lg'>✓</span>
									</td>
								</tr>
								<tr>
									<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900'>
										クイズ回数
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-center text-sm text-slate-700'>
										制限あり
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-center text-sm text-slate-700 bg-purple-50'>
										無制限
									</td>
								</tr>
								<tr>
									<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900'>
										新機能アクセス
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-center text-sm text-slate-700'>
										<span className='text-red-500 text-lg'>✕</span>
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-center text-sm text-slate-700 bg-purple-50'>
										<span className='text-green-500 text-lg'>✓</span>
									</td>
								</tr>
							</tbody>
						</table>
					</div>

					<div className='mt-8 text-center'>
						<Button className='bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 text-lg px-8'>
							プレミアムにアップグレード
						</Button>
						<p className='mt-2 text-sm text-slate-500'>
							<strong className='text-purple-600'>買い切り</strong>でずっと使える
						</p>
					</div>
				</section>

				{/* サポート・問い合わせセクション */}
				<section className='bg-white rounded-xl shadow-lg p-6 border border-slate-200'>
					<h2 className='text-2xl font-bold text-slate-900 mb-4'>サポート・問い合わせ</h2>
					<div className='space-y-4 text-slate-700'>
						<p>
							「いろポン！」に関するご質問、ご要望、改善提案などがございましたら、
							下記のお問い合わせフォームよりご連絡ください。 サポートチームが迅速に対応いたします。
						</p>

						<div className='mt-6'>
							<Button onClick={onOpenContactForm} variant='secondary'>
								お問い合わせフォームを開く
							</Button>
						</div>

						<div className='mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200'>
							<h3 className='text-lg font-semibold text-blue-800 mb-2'>よくある質問</h3>
							<ul className='space-y-3'>
								<li>
									<p className='font-medium'>
										Q: プレミアムプランは一度購入すれば永続的に使えますか？
									</p>
									<p className='text-slate-600 mt-1'>
										A:
										はい、プレミアムプランは買い切り型で、一度購入いただくと永続的にご利用いただけます。
									</p>
								</li>
								<li>
									<p className='font-medium'>Q: 色彩検定の公式アプリですか？</p>
									<p className='text-slate-600 mt-1'>
										A:
										いいえ、「いろポン！」は色彩検定の公式アプリではありません。色彩検定の学習をサポートする非公式のアプリです。
									</p>
								</li>
								<li>
									<p className='font-medium'>
										Q: アプリの不具合を見つけた場合はどうすればよいですか？
									</p>
									<p className='text-slate-600 mt-1'>
										A:
										お問い合わせフォームより詳細をお知らせください。できるだけ早く対応いたします。
									</p>
								</li>
							</ul>
						</div>
					</div>
				</section>
			</main>

			<div className='mt-8 text-center'>
				<Button onClick={onGoHome} variant='secondary'>
					ホームに戻る
				</Button>
			</div>

			<footer className='text-center mt-12 space-y-4'>
				<p className='text-sm text-slate-500'>&copy; 2025 いろポン！. All rights reserved.</p>
			</footer>
		</div>
	);
};

export default ServiceInfo;
