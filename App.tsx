import React, { useState, useEffect } from 'react';
import HomeScreen from './components/HomeScreen';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';
import ColorListScreen from './components/ColorListScreen';
import GradientQuizScreen from './components/GradientQuizScreen';
import PasswordModal from './components/PasswordModal';
import ContactForm from './components/ContactForm';
import TermsOfService from './components/TermsOfService';
import ServiceInfo from './components/ServiceInfo';
import { GameState } from './types';

// The "secret" password for paid content
const UNLOCK_PASSWORD = 'colorMaster';
const UNLOCK_STORAGE_KEY = 'iropon_unlocked';

const App: React.FC = () => {
	// State to manage the current view of the application (e.g., home screen, quiz, results).
	const [gameState, setGameState] = useState<GameState>(GameState.Home);

	// State to store the currently selected quiz grade.
	const [currentGrade, setCurrentGrade] = useState<number | null>(null);

	// State to store the final score of the quiz.
	const [finalScore, setFinalScore] = useState<number>(0);

	// State to store the total number of questions in the completed quiz.
	const [totalQuestions, setTotalQuestions] = useState<number>(0);

	// State for password modal
	const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
	const [gradeToUnlock, setGradeToUnlock] = useState<number | null>(null);
	const [isUnlocked, setIsUnlocked] = useState(false);

	// State for contact form
	const [isContactFormOpen, setIsContactFormOpen] = useState(false);

	// State for terms of service modal
	const [isTermsOfServiceOpen, setIsTermsOfServiceOpen] = useState(false);

	// On initial load, check if the user has already unlocked the content.
	useEffect(() => {
		const unlockedStatus = localStorage.getItem(UNLOCK_STORAGE_KEY);
		if (unlockedStatus === 'true') {
			setIsUnlocked(true);
		}
	}, []);

	/**
	 * Handles the selection of a grade from the home screen.
	 * For free grades or if already unlocked, it starts the quiz. For locked grades, it opens the password modal.
	 * @param grade The selected grade (e.g., 3, 2, or 1).
	 */
	const handleSelectGrade = (grade: number) => {
		// 一時的にすべての級を無料で利用可能にする
		setCurrentGrade(grade);
		setGameState(GameState.Quiz);

		// 元のコード（コメントアウト）
		// // Grade 3 is free, or if the user has already unlocked paid content.
		// if (grade === 3 || isUnlocked) {
		//     setCurrentGrade(grade);
		//     setGameState(GameState.Quiz);
		// } else { // Grades 1 and 2 are locked and require a password.
		//     setGradeToUnlock(grade);
		//     setIsPasswordModalOpen(true);
		// }
	};

	/**
	 * Handles the submission of the password from the modal.
	 * @param password The password entered by the user.
	 * @returns `true` if the password is correct, `false` otherwise.
	 */
	const handlePasswordSubmit = (password: string): boolean => {
		if (password === UNLOCK_PASSWORD) {
			// Unlock the content and persist the state in localStorage.
			setIsUnlocked(true);
			localStorage.setItem(UNLOCK_STORAGE_KEY, 'true');

			// Continue to the quiz.
			setCurrentGrade(gradeToUnlock);
			setGameState(GameState.Quiz);
			setIsPasswordModalOpen(false);
			setGradeToUnlock(null);
			return true;
		}
		return false;
	};

	/**
	 * Handles closing the password modal.
	 */
	const handleClosePasswordModal = () => {
		setIsPasswordModalOpen(false);
		setGradeToUnlock(null);
	};

	/**
	 * Handles the completion of a quiz.
	 * It captures the final score and total questions, then transitions the app to the results view.
	 * @param score The number of correct answers.
	 * @param total The total number of questions in the quiz.
	 */
	const handleQuizComplete = (score: number, total: number) => {
		setFinalScore(score);
		setTotalQuestions(total);
		setGameState(GameState.Results);
	};

	/**
	 * Handles the "restart" action from the results screen.
	 * It resets the quiz-related state and transitions back to the quiz view for the same grade.
	 */
	const handleRestartQuiz = () => {
		setFinalScore(0);
		setTotalQuestions(0);
		setGameState(GameState.Quiz);
	};

	/**
	 * Handles the "go to home" action from various screens.
	 * It resets all game-related state and transitions back to the home screen.
	 */
	const handleGoHome = () => {
		setGameState(GameState.Home);
		setCurrentGrade(null);
		setFinalScore(0);
		setTotalQuestions(0);
	};

	/**
	 * Transitions the app to the color list view.
	 */
	const handleShowColorList = () => {
		setGameState(GameState.ColorList);
	};

	/**
	 * Transitions the app to the service info view.
	 */
	const handleShowServiceInfo = () => {
		setGameState(GameState.ServiceInfo);
	};

	/**
	 * Opens the contact form.
	 */
	const handleOpenContactForm = () => {
		setIsContactFormOpen(true);
	};

	/**
	 * Closes the contact form.
	 */
	const handleCloseContactForm = () => {
		setIsContactFormOpen(false);
	};

	/**
	 * Opens the terms of service modal.
	 */
	const handleOpenTermsOfService = () => {
		setIsTermsOfServiceOpen(true);
	};

	/**
	 * Closes the terms of service modal.
	 */
	const handleCloseTermsOfService = () => {
		setIsTermsOfServiceOpen(false);
	};

	// Renders the appropriate component based on the current game state.
	const renderContent = () => {
		switch (gameState) {
			case GameState.Quiz:
				if (currentGrade === 1) {
					return <GradientQuizScreen onQuizComplete={handleQuizComplete} onGoHome={handleGoHome} />;
				}
				return (
					currentGrade && (
						<QuizScreen
							grade={currentGrade}
							onQuizComplete={handleQuizComplete}
							onGoHome={handleGoHome}
						/>
					)
				);
			case GameState.Results:
				return (
					currentGrade && (
						<ResultsScreen
							score={finalScore}
							totalQuestions={totalQuestions}
							grade={currentGrade}
							onRestart={handleRestartQuiz}
							onGoHome={handleGoHome}
							onOpenContactForm={handleOpenContactForm}
						/>
					)
				);
			case GameState.ColorList:
				return (
					<ColorListScreen onGoHome={handleGoHome} onOpenContactForm={handleOpenContactForm} />
				);
			case GameState.ServiceInfo:
				return <ServiceInfo onGoHome={handleGoHome} onOpenContactForm={handleOpenContactForm} />;
			case GameState.Home:
			default:
				return (
					<HomeScreen
						onSelectGrade={handleSelectGrade}
						onShowColorList={handleShowColorList}
						isUnlocked={isUnlocked}
						onOpenContactForm={handleOpenContactForm}
						onOpenTermsOfService={handleOpenTermsOfService}
						onShowServiceInfo={handleShowServiceInfo}
					/>
				);
		}
	};

	return (
		<div className='min-h-screen w-full flex items-center justify-center font-sans antialiased text-slate-800 p-4'>
			{renderContent()}
			<PasswordModal
				isOpen={isPasswordModalOpen}
				onClose={handleClosePasswordModal}
				onSubmit={handlePasswordSubmit}
				grade={gradeToUnlock}
			/>
			<ContactForm isOpen={isContactFormOpen} onClose={handleCloseContactForm} />
			<TermsOfService isOpen={isTermsOfServiceOpen} onClose={handleCloseTermsOfService} />
		</div>
	);
};

export default App;
