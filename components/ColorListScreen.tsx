import React, { useState, useEffect } from 'react';
import { ColorData } from '../types';
import Button from './Button';
import ColorCard from './ColorCard';
import colorsData from '../data/colors.json';

interface ColorListScreenProps {
	onGoHome: () => void;
}

const ColorListScreen: React.FC<ColorListScreenProps> = ({ onGoHome }) => {
	const [allColors, setAllColors] = useState<ColorData[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		try {
			setAllColors(colorsData as ColorData[]);
			setIsLoading(false);
		} catch (error) {
			console.error('Failed to load color data:', error);
			setIsLoading(false);
		}
	}, []);

	const scrollToGrade = (grade: number) => {
		const element = document.getElementById(`grade-section-${grade}`);
		if (element) {
			// Use smooth scrolling to navigate to the section.
			element.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	};

	/**
	 * Extracts the hue number from a PCCS notation string for sorting.
	 * @param pccs The PCCS notation string (e.g., "v2", "lt10+", "Gy-5.0").
	 * @returns A number representing the hue for sorting. Achromatic colors are given a high number to sort them last.
	 */
	const getHueForSorting = (pccs: string): number => {
		// Group achromatic colors (White, Grey, Black) at the end.
		if (pccs.startsWith('W') || pccs.startsWith('Gy-') || pccs === 'Bk') {
			return 100; // A large number to ensure they come after all chromatic colors.
		}

		// Use regex to find the number in the PCCS string.
		const match = pccs.match(/\d+/);
		if (match) {
			return parseInt(match[0], 10);
		}

		// Fallback for any unexpected format, sorting them at the very end.
		return 200;
	};

	const groupedColors = allColors.reduce((acc, color) => {
		(acc[color.grade] = acc[color.grade] || []).push(color);
		return acc;
	}, {} as Record<number, ColorData[]>);

	// Sort the colors within each grade group based on their hue.
	for (const grade in groupedColors) {
		groupedColors[grade].sort((a, b) => {
			const hueA = getHueForSorting(a.pccs_notation);
			const hueB = getHueForSorting(b.pccs_notation);

			if (hueA !== hueB) {
				return hueA - hueB;
			}
			return a.id - b.id; // Stable sort fallback
		});
	}

	if (isLoading) {
		return <div className='flex justify-center items-center h-screen text-slate-500'>カラーデータを読み込み中...</div>;
	}

	return (
		<div className='w-full max-w-4xl mx-auto py-4 sm:p-6'>
			<header className='flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4'>
				<h1
					className='text-3xl sm:text-4xl font-extrabold text-slate-900'
					style={{
						fontFamily: '"Mochiy Pop P One", sans-serif',
						fontWeight: 400,
						fontStyle: 'normal',
					}}
				>
					慣用色名一覧
				</h1>
				<div className='flex flex-col sm:flex-row gap-2'>
					<Button onClick={() => scrollToGrade(3)} variant='secondary' className='sm:w-auto'>
						3級へ
					</Button>
					<Button onClick={() => scrollToGrade(2)} variant='secondary' className='sm:w-auto'>
						2級へ
					</Button>
					<Button onClick={onGoHome} variant='secondary' className='sm:w-auto'>
						ホームに戻る
					</Button>
				</div>
			</header>

			<main className='space-y-12'>
				{Object.keys(groupedColors)
					.sort((a, b) => Number(b) - Number(a))
					.map((grade) => (
						<section key={grade} id={`grade-section-${grade}`}>
							<h2 className='sticky top-0 bg-slate-50 z-10 text-2xl font-bold text-slate-800 border-b-2 border-cyan-500 py-4 mb-6 w-[calc(100%+1rem)] -translate-x-2 pl-2'>{grade}級</h2>
							<div className='grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'>
								{groupedColors[parseInt(grade, 10)].map((color) => (
									<ColorCard key={color.id} color={color} />
								))}
							</div>
						</section>
					))}
			</main>

			<footer className='mt-12 text-center'>
				<div className='max-w-xs mx-auto'>
					<Button onClick={onGoHome} variant='secondary'>
						ホームに戻る
					</Button>
				</div>
			</footer>
		</div>
	);
};

export default ColorListScreen;
