
import React, { useState, useEffect, useCallback } from 'react';
import { GradientQuizQuestion, GradientColorData } from '../types';
import Button from './Button';
import { CheckIcon, XIcon } from './icons';

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

// Helper to convert hex to HSL for sorting
const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return { h: 0, s: 0, l: 0 };
    
    let r = parseInt(result[1], 16) / 255;
    let g = parseInt(result[2], 16) / 255;
    let b = parseInt(result[3], 16) / 255;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h, s, l };
};

const GradientQuizScreen: React.FC<{ onQuizComplete: (score: number, total: number) => void; onGoHome: () => void; }> = ({ onQuizComplete, onGoHome }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [questions, setQuestions] = useState<GradientQuizQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userOrder, setUserOrder] = useState<GradientColorData[]>([]);
    const [score, setScore] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    
    // D&D state
    const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);


    useEffect(() => {
        fetch('../data/grade1_colors.json')
            .then(res => res.json())
            .then((data: GradientQuizQuestion[]) => {
                setQuestions(shuffleArray(data).slice(0, TOTAL_QUESTIONS));
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Failed to load grade 1 quiz data:", error);
                setIsLoading(false);
            });
    }, []);

    const setupQuestion = useCallback(() => {
        if (questions.length > 0) {
            const currentQuestion = questions[currentQuestionIndex];
            setUserOrder(shuffleArray(currentQuestion.colors));
            setIsSubmitted(false);
        }
    }, [questions, currentQuestionIndex]);
    
    useEffect(setupQuestion, [setupQuestion]);

    const getCorrectOrder = useCallback(() => {
        const question = questions[currentQuestionIndex];
        return [...question.colors].sort((a, b) => {
            const hslA = hexToHsl(a.color_code);
            const hslB = hexToHsl(b.color_code);
            const valueA = question.type === 'lightness' ? hslA.l : hslA.s;
            const valueB = question.type === 'lightness' ? hslB.l : hslB.s;
            return question.direction === 'desc' ? valueB - valueA : valueA - valueB;
        });
    }, [questions, currentQuestionIndex]);

    const handleSubmit = () => {
        if (isSubmitted) return;

        const correctOrder = getCorrectOrder();
        const userIsCorrect = userOrder.every((color, index) => color.color_code === correctOrder[index].color_code);
        
        setIsCorrect(userIsCorrect);
        setIsSubmitted(true);
        if (userIsCorrect) {
            setScore(prev => prev + 1);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            onQuizComplete(score, questions.length);
        }
    };
    
    // --- D&D Handlers ---
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        setDraggedItemIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        // Minor delay to allow DOM to update for `dragging` class
        setTimeout(() => e.currentTarget.classList.add('dragging'), 0);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
        if (draggedItemIndex === null || draggedItemIndex === index) return;
        setDragOverIndex(index);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
        e.preventDefault();
        if (draggedItemIndex === null) return;
        
        const draggedItem = userOrder[draggedItemIndex];
        const newOrder = [...userOrder];
        newOrder.splice(draggedItemIndex, 1);
        newOrder.splice(dropIndex, 0, draggedItem);
        
        setUserOrder(newOrder);
        setDraggedItemIndex(null);
        setDragOverIndex(null);
    };
    
    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove('dragging');
        setDraggedItemIndex(null);
        setDragOverIndex(null);
    };


    if (isLoading) return <div className="text-slate-500">1級クイズを読み込み中...</div>;
    if (questions.length === 0) return <div className="text-slate-500">問題が見つかりません。</div>;
    
    const currentQuestion = questions[currentQuestionIndex];
    const correctOrder = isSubmitted ? getCorrectOrder() : [];

    return (
        <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
            <header className="mb-6 text-center">
                <p className="text-lg font-semibold text-cyan-700">1級 - 問題 {currentQuestionIndex + 1} / {questions.length}</p>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-2">{currentQuestion.description}</h2>
            </header>

            <main className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-200">
                <div className="grid grid-cols-5 gap-3 mb-6" onDragOver={(e) => e.preventDefault()}>
                    {userOrder.map((color, index) => (
                         <div
                            key={color.color_code}
                            draggable={!isSubmitted}
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragEnd={handleDragEnd}
                            onDragLeave={() => setDragOverIndex(null)}
                            className={`h-32 sm:h-48 rounded-lg cursor-grab transition-all duration-200 ${isSubmitted ? 'cursor-not-allowed' : 'active:cursor-grabbing'} border-4 ${dragOverIndex === index ? 'border-cyan-500' : 'border-transparent'}`}
                            style={{ backgroundColor: color.color_code }}
                            aria-label={color.color_name}
                        ></div>
                    ))}
                </div>

                {!isSubmitted && (
                    <Button onClick={handleSubmit} className="w-full sm:w-auto sm:px-10 mx-auto block">確認する</Button>
                )}
                
                {isSubmitted && (
                    <div className="mt-8 pt-6 border-t border-slate-200 animate-fade-in">
                        <div className="text-center mb-6">
                            {isCorrect ? (
                                <div className="inline-flex items-center gap-2 text-3xl font-bold text-green-600">
                                    <CheckIcon className="w-8 h-8"/> 正解！
                                </div>
                            ) : (
                                <div className="inline-flex items-center gap-2 text-3xl font-bold text-red-500">
                                    <XIcon className="w-8 h-8"/> 残念！
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
                            <div>
                                <h3 className="font-bold text-lg mb-2 text-slate-700">あなたの回答</h3>
                                <div className="flex flex-col gap-1">
                                    {userOrder.map(c => (
                                        <div key={`user-${c.color_code}`} className="flex items-center gap-2 p-2 rounded bg-slate-50 border">
                                            <div className="w-8 h-8 rounded shrink-0" style={{backgroundColor: c.color_code}}></div>
                                            <span className="text-sm font-medium text-left">
                                                {c.color_name}
                                                <span className="text-xs text-slate-500 font-normal ml-2">{c.munsell_value}</span>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                             <div>
                                <h3 className="font-bold text-lg mb-2 text-slate-700">正しい順序</h3>
                                <div className="flex flex-col gap-1">
                                    {correctOrder.map(c => (
                                        <div key={`correct-${c.color_code}`} className="flex items-center gap-2 p-2 rounded bg-green-50 border border-green-200">
                                            <div className="w-8 h-8 rounded shrink-0" style={{backgroundColor: c.color_code}}></div>
                                            <span className="text-sm font-medium text-green-800 text-left">
                                                {c.color_name}
                                                <span className="text-xs text-slate-500 font-normal ml-2">{c.munsell_value}</span>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 text-center">
                            <Button onClick={handleNextQuestion} className="w-full sm:w-auto sm:px-10 mx-auto block">
                                {currentQuestionIndex < questions.length - 1 ? '次の問題へ' : '結果を見る'}
                            </Button>
                        </div>
                    </div>
                )}
            </main>
            <footer className="mt-8 text-center">
                <div className="max-w-xs mx-auto">
                    <Button onClick={onGoHome} variant="secondary">
                        ホームに戻る
                    </Button>
                </div>
            </footer>
        </div>
    );
};


// Add keyframes for animation in a style tag for dynamic classes
const style = document.createElement('style');
style.innerHTML = `
@keyframes fade-in {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}
.dragging {
  opacity: 0.5;
  transform: scale(1.05);
  box-shadow: 0 1rem 1.5rem rgba(0,0,0,0.15);
}
`;
document.head.appendChild(style);


export default GradientQuizScreen;