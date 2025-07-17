import React from 'react';
import { ColorData } from '../types';

interface ColorCardProps {
	color: ColorData;
}

const ColorCard: React.FC<ColorCardProps> = ({ color }) => {
	return (
		<div className='bg-white rounded-lg shadow-md p-4 border border-slate-200 flex flex-col transition-all duration-300 hover:shadow-xl hover:scale-105'>
			<div className='w-full h-24 rounded-md mb-3 border border-slate-200' style={{ backgroundColor: color.color_code }}></div>
			<div className='flex-grow'>
				<h3 className='text-lg font-bold text-slate-900'>{color.color_name}</h3>
				<p className='text-sm text-slate-600 mb-2'>{color.system_name}</p>
				<p className='text-sm text-slate-700 pb-2 leading-relaxed'>{color.explanation}</p>
			</div>

			<div className='mt-auto pt-2 border-t border-slate-100 text-xs text-slate-500'>
				<dl className='space-y-1'>
					<div className='flex justify-between'>
						<dt className='font-semibold text-slate-600'>マンセル:</dt>
						<dd className='font-mono'>{color.munsell_value}</dd>
					</div>
					<div className='flex justify-between'>
						<dt className='font-semibold text-slate-600'>PCCS:</dt>
						<dd className='font-mono'>{color.pccs_notation}</dd>
					</div>
				</dl>
			</div>
		</div>
	);
};

export default ColorCard;
