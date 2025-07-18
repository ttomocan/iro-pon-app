import React, { useEffect } from 'react';
import Button from './Button';
import { ColorData } from '../types';
import { CheckIcon, XIcon } from './icons';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	isCorrect: boolean;
	colorData: ColorData;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, isCorrect, colorData }) => {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape' || e.key === 'Enter') {
				e.preventDefault();
				onClose();
			}
		};
		if (isOpen) {
			window.addEventListener('keydown', handleKeyDown);
		}
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [isOpen, onClose]);

	if (!isOpen) {
		return null;
	}

	const { color_name, color_code, system_name, explanation, munsell_value, pccs_notation } = colorData;

	const borderColor = isCorrect ? 'border-green-500' : 'border-red-500';
	const iconBgColor = isCorrect ? 'bg-green-100' : 'bg-red-100';
	const iconColor = isCorrect ? 'text-green-600' : 'text-red-600';
	const icon = isCorrect ? <CheckIcon className='w-16 h-16' /> : <XIcon className='w-16 h-16' />;
	const titleText = isCorrect ? '正解！' : '不正解…';
	const titleColor = isCorrect ? 'text-green-600' : 'text-red-500';

	return (
		<div className='fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4 animate-fade-in' onClick={onClose}>
			<div className={`relative w-full max-w-md max-h-[90vh] rounded-2xl shadow-2xl bg-white text-center transform transition-all duration-300 ease-out scale-95 animate-fade-in-up border-t-8 ${borderColor} flex flex-col`} onClick={(e) => e.stopPropagation()}>
				<div className='p-4 sm:p-8 flex-1 overflow-y-auto'>
					<div className={`mx-auto w-20 h-20 flex items-center justify-center rounded-full mb-4 ${iconBgColor} ${iconColor}`}>{icon}</div>

					<h2 className={`text-4xl font-extrabold mb-2 ${titleColor}`}>{titleText}</h2>
					<p className={`text-lg font-bold text-slate-900`}>正解は「{color_name}」</p>

					<div className='my-6 p-4 rounded-lg bg-slate-50 text-left'>
						<div className='w-full h-24 rounded-lg mb-3 border border-slate-200' style={{ backgroundColor: color_code }}></div>
						<p className='font-semibold text-slate-800 text-lg text-center'>{system_name}</p>

						<div className='mt-4 border-t border-slate-200 pt-3 text-sm text-slate-600'>
							<div className='space-y-1'>
								<p>
									<span className='font-semibold text-slate-700'>マンセル値:</span> {munsell_value}
								</p>
								<p>
									<span className='font-semibold text-slate-700'>PCCS:</span> {pccs_notation}
								</p>
							</div>
						</div>
					</div>

					<p className='text-slate-600 text-left text-base leading-relaxed mb-8'>{explanation}</p>
				</div>

				<div className='p-4 sm:p-8 border-t border-slate-200 bg-white'>
					<Button onClick={onClose} variant='primary'>
						次へ
					</Button>
				</div>
			</div>
		</div>
	);
};

// Add keyframes for animation in a style tag since we can't use external CSS files.
const style = document.createElement('style');
style.innerHTML = `
@keyframes fade-in {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
@keyframes fade-in-up {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.animate-fade-in {
  animation: fade-in 0.2s ease-out forwards;
}
.animate-fade-in-up {
  animation: fade-in-up 0.3s ease-out forwards;
}
`;
document.head.appendChild(style);

export default Modal;
