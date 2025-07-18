import React, { useState } from 'react';
import Button from './Button';

interface ContactFormProps {
	isOpen: boolean;
	onClose: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ isOpen, onClose }) => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		subject: '',
		message: '',
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			console.log('送信開始:', formData);

			// Formspreeを使用したメール送信
			const formDataToSend = new FormData();
			formDataToSend.append('name', formData.name);
			formDataToSend.append('email', formData.email);
			formDataToSend.append('subject', formData.subject);
			formDataToSend.append('message', formData.message);

			console.log('FormData作成完了');

			const response = await fetch('https://formspree.io/f/mwpqpldv', {
				method: 'POST',
				body: formDataToSend,
				headers: {
					Accept: 'application/json',
				},
			});

			console.log('レスポンス:', response.status, response.statusText);

			if (response.ok) {
				const result = await response.json();
				console.log('送信成功:', result);
				setIsSubmitting(false);
				setIsSubmitted(true);
			} else {
				const errorData = await response.json();
				console.error('Formspree error:', errorData);
				throw new Error(`送信に失敗しました: ${response.status}`);
			}
		} catch (error) {
			console.error('送信エラー:', error);
			setIsSubmitting(false);
			alert('送信に失敗しました。しばらく時間をおいて再度お試しください。');
		}
	};

	if (!isOpen) {
		return null;
	}

	if (isSubmitted) {
		return (
			<div className='fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4 animate-fade-in'>
				<div className='relative w-full max-w-md rounded-2xl shadow-2xl bg-white text-center transform transition-all duration-300 ease-out scale-95 animate-fade-in-up'>
					<div className='p-8'>
						<div className='mx-auto w-20 h-20 flex items-center justify-center rounded-full mb-4 bg-green-100 text-green-600'>
							<svg className='w-12 h-12' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
								<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
							</svg>
						</div>
						<h2 className='text-2xl font-bold text-slate-900 mb-4'>送信完了</h2>
						<p className='text-slate-600 mb-6'>
							お問い合わせありがとうございます。
							<br />
							内容を確認の上、サービス向上の参考とさせていただきます。
						</p>
						<Button onClick={onClose} variant='primary'>
							閉じる
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4 animate-fade-in'>
			<div className='relative w-full max-w-lg max-h-[90vh] rounded-2xl shadow-2xl bg-white transform transition-all duration-300 ease-out scale-95 animate-fade-in-up flex flex-col'>
				<div className='p-6 sm:p-8 flex-1 overflow-y-auto'>
					<div className='flex justify-between items-center mb-6'>
						<h2 className='text-2xl font-bold text-slate-900'>お問い合わせ</h2>
						<button onClick={onClose} className='text-slate-400 hover:text-slate-600 transition-colors'>
							<svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
								<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
							</svg>
						</button>
					</div>

					<form onSubmit={handleSubmit} className='space-y-6' name='contact' method='POST' data-netlify='true'>
						<input type='hidden' name='form-name' value='contact' />
						<div>
							<label htmlFor='name' className='block text-sm font-medium text-slate-700 mb-2'>
								お名前 <span className='text-red-500'>*</span>
							</label>
							<input type='text' id='name' name='name' value={formData.name} onChange={handleChange} required className='w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent' placeholder='山田太郎' />
						</div>

						<div>
							<label htmlFor='email' className='block text-sm font-medium text-slate-700 mb-2'>
								メールアドレス <span className='text-red-500'>*</span>
							</label>
							<input type='email' id='email' name='email' value={formData.email} onChange={handleChange} required className='w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent' placeholder='example@email.com' />
						</div>

						<div>
							<label htmlFor='subject' className='block text-sm font-medium text-slate-700 mb-2'>
								件名 <span className='text-red-500'>*</span>
							</label>
							<select id='subject' name='subject' value={formData.subject} onChange={handleChange} required className='w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent'>
								<option value=''>選択してください</option>
								<option value='bug'>バグ報告</option>
								<option value='feature'>機能要望</option>
								<option value='improvement'>改善提案</option>
								<option value='question'>質問・相談</option>
								<option value='other'>その他</option>
							</select>
						</div>

						<div>
							<label htmlFor='message' className='block text-sm font-medium text-slate-700 mb-2'>
								メッセージ <span className='text-red-500'>*</span>
							</label>
							<textarea id='message' name='message' value={formData.message} onChange={handleChange} required rows={6} className='w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none' placeholder='お問い合わせ内容を詳しくお聞かせください。' />
						</div>
					</form>
				</div>

				<div className='p-6 sm:p-8 border-t border-slate-200 bg-white'>
					<div className='flex gap-3'>
						<Button onClick={onClose} variant='secondary' className='flex-1'>
							キャンセル
						</Button>
						<Button onClick={handleSubmit} variant='primary' className='flex-1' disabled={isSubmitting || !formData.name || !formData.email || !formData.subject || !formData.message}>
							{isSubmitting ? '送信中...' : '送信する'}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ContactForm;
