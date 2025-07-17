
import React, { useState, useEffect } from 'react';
import Button from './Button';
import { LockIcon } from './icons';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => boolean; // Returns true on success, false on failure
  grade: number | null;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose, onSubmit, grade }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  // Reset state when modal is opened or closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setPassword('');
        setError('');
      }, 300); // Wait for animation to finish
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = onSubmit(password);
    if (!success) {
      setError('パスワードが違います。');
      setPassword('');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500); // Duration of the shake animation
    }
  };

  if (!isOpen) {
    return null;
  }
  
  const getModalTitle = (g: number | null): string => {
    if (g === 23) {
      return '2・3級';
    }
    return g ? `${g}級` : '';
  };
  
  const shakeClass = isShaking ? 'animate-shake' : '';

  return (
    <div 
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className={`relative w-full max-w-sm rounded-2xl shadow-2xl bg-white text-center transform transition-all duration-300 ease-out scale-95 animate-fade-in-up ${shakeClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8">
            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full mb-4 bg-cyan-100 text-cyan-600">
              <LockIcon className="w-8 h-8" />
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{getModalTitle(grade)} ロック解除</h2>
            <p className="text-slate-600 mb-6">
              このレベルにアクセスするにはパスワードを入力してください。一度ロックを解除すると、次回以降はパスワードの入力は不要になります。
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワード"
                autoFocus
                className="w-full px-4 py-3 rounded-lg border-2 bg-slate-800 text-white placeholder-slate-400 border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                aria-describedby="password-error"
              />
              
              {error && (
                <p id="password-error" className="text-red-500 text-sm font-semibold animate-fade-in">
                  {error}
                </p>
              )}

              <div className="pt-2 space-y-3">
                <Button type="submit" variant="primary">
                  ロック解除
                </Button>
                <Button type="button" onClick={onClose} variant="secondary">
                  キャンセル
                </Button>
              </div>
            </form>
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
@keyframes shake {
  10%, 90% { transform: translateX(-1px); }
  20%, 80% { transform: translateX(2px); }
  30%, 50%, 70% { transform: translateX(-4px); }
  40%, 60% { transform: translateX(4px); }
}
.animate-fade-in {
  animation: fade-in 0.2s ease-out forwards;
}
.animate-fade-in-up {
  animation: fade-in-up 0.3s ease-out forwards;
}
.animate-shake {
    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}
`;
document.head.appendChild(style);


export default PasswordModal;