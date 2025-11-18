import { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, RefreshCw, Volume2 } from 'lucide-react';
import { Button } from './ui/button';

interface BotDetectionProps {
  onVerified: () => void;
  onFailed?: () => void;
  difficulty?: 'easy' | 'medium' | 'hard';
  type?: 'auto' | 'slider' | 'image' | 'math' | 'pattern';
}

type ChallengeType = 'slider' | 'image' | 'math' | 'pattern' | 'audio';

export function BotDetection({ onVerified, onFailed, difficulty = 'medium', type = 'auto' }: BotDetectionProps) {
  const [challengeType, setChallengeType] = useState<ChallengeType>('slider');
  const [verified, setVerified] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [startTime] = useState(Date.now());

  // Slider Challenge State
  const [sliderValue, setSliderValue] = useState(0);
  const [targetValue] = useState(Math.floor(Math.random() * 20) + 80); // 80-100

  // Math Challenge State
  const [mathAnswer, setMathAnswer] = useState('');
  const [mathProblem] = useState(() => {
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;
    const operations = ['+', '-'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    return { num1, num2, operation };
  });

  // Image Challenge State
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [imageChallenge] = useState(() => {
    const challenges = [
      { prompt: 'Select all images with Kilimanjaro', correctIndexes: [0, 3, 7] },
      { prompt: 'Select all images with wildlife', correctIndexes: [1, 4, 6] },
      { prompt: 'Select all images with beaches', correctIndexes: [2, 5, 8] }
    ];
    return challenges[Math.floor(Math.random() * challenges.length)];
  });

  // Pattern Challenge State
  const [patternSequence] = useState(() => {
    const patterns = ['🦁', '🐘', '🦒', '🦓', '🦏'];
    const length = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5;
    return Array.from({ length }, () => patterns[Math.floor(Math.random() * patterns.length)]);
  });
  const [userPattern, setUserPattern] = useState<string[]>([]);
  const [showPattern, setShowPattern] = useState(true);

  useEffect(() => {
    // Auto-select challenge type based on risk
    if (type === 'auto') {
      const types: ChallengeType[] = ['slider', 'math', 'image', 'pattern'];
      setChallengeType(types[attempts % types.length]);
    } else {
      setChallengeType(type as ChallengeType);
    }
  }, [attempts, type]);

  useEffect(() => {
    // Hide pattern after 3 seconds for pattern challenge
    if (challengeType === 'pattern' && showPattern) {
      const timer = setTimeout(() => setShowPattern(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [challengeType, showPattern]);

  const handleVerification = (success: boolean) => {
    const timeTaken = Date.now() - startTime;
    
    // Bot detection heuristics
    const tooFast = timeTaken < 500; // Completed in less than 500ms
    const tooSlow = timeTaken > 60000; // Took more than 1 minute
    
    if (success && !tooFast && !tooSlow) {
      setVerified(true);
      setTimeout(() => onVerified(), 1000);
    } else {
      setFailed(true);
      setAttempts(prev => prev + 1);
      
      if (attempts >= 2) {
        onFailed?.();
      } else {
        setTimeout(() => {
          setFailed(false);
          resetChallenge();
        }, 2000);
      }
    }
  };

  const resetChallenge = () => {
    setSliderValue(0);
    setMathAnswer('');
    setSelectedImages([]);
    setUserPattern([]);
    setShowPattern(true);
  };

  const checkSlider = () => {
    const isCorrect = Math.abs(sliderValue - targetValue) <= 5;
    handleVerification(isCorrect);
  };

  const checkMath = () => {
    const { num1, num2, operation } = mathProblem;
    const correct = operation === '+' ? num1 + num2 : num1 - num2;
    const isCorrect = parseInt(mathAnswer) === correct;
    handleVerification(isCorrect);
  };

  const checkImages = () => {
    const correct = imageChallenge.correctIndexes;
    const isCorrect = 
      selectedImages.length === correct.length &&
      selectedImages.every(idx => correct.includes(idx));
    handleVerification(isCorrect);
  };

  const checkPattern = () => {
    const isCorrect = 
      userPattern.length === patternSequence.length &&
      userPattern.every((item, idx) => item === patternSequence[idx]);
    handleVerification(isCorrect);
  };

  const toggleImage = (index: number) => {
    setSelectedImages(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const addToPattern = (emoji: string) => {
    if (userPattern.length < patternSequence.length) {
      setUserPattern(prev => [...prev, emoji]);
    }
  };

  if (verified) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-xl text-center animate-in zoom-in-95 duration-300">
        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="size-10 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Verification Successful!</h3>
        <p className="text-sm text-gray-600">You've been verified as human</p>
      </div>
    );
  }

  if (failed && attempts >= 3) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-xl text-center">
        <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="size-10 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Verification Failed</h3>
        <p className="text-sm text-gray-600 mb-4">Too many failed attempts. Please try again later.</p>
        <Button 
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-full"
        >
          Reload
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl max-w-md w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center">
          <Shield className="size-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900">Security Verification</h3>
          <p className="text-xs text-gray-600">Prove you're human</p>
        </div>
        {attempts > 0 && (
          <span className="text-xs text-amber-600 font-semibold">
            Attempt {attempts + 1}/3
          </span>
        )}
      </div>

      {failed && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
          <p className="text-sm text-red-800 font-semibold">❌ Verification failed. Try again.</p>
        </div>
      )}

      {/* Slider Challenge */}
      {challengeType === 'slider' && (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-900 mb-2">
              Slide to match the target
            </p>
            <div className="bg-gray-100 rounded-xl p-4 mb-4">
              <p className="text-3xl font-bold text-blue-600">{targetValue}</p>
            </div>
          </div>

          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="100"
              value={sliderValue}
              onChange={(e) => setSliderValue(parseInt(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #2563eb 0%, #2563eb ${sliderValue}%, #e5e7eb ${sliderValue}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>0</span>
              <span className="font-bold text-gray-900">{sliderValue}</span>
              <span>100</span>
            </div>
          </div>

          <Button
            onClick={checkSlider}
            disabled={sliderValue === 0}
            className="w-full h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300"
          >
            Verify
          </Button>
        </div>
      )}

      {/* Math Challenge */}
      {challengeType === 'math' && (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-900 mb-4">
              Solve this simple math problem
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-4">
              <p className="text-4xl font-bold text-gray-900">
                {mathProblem.num1} {mathProblem.operation} {mathProblem.num2} = ?
              </p>
            </div>
          </div>

          <input
            type="number"
            value={mathAnswer}
            onChange={(e) => setMathAnswer(e.target.value)}
            placeholder="Enter answer"
            className="w-full h-14 px-4 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600"
          />

          <Button
            onClick={checkMath}
            disabled={!mathAnswer}
            className="w-full h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300"
          >
            Submit Answer
          </Button>
        </div>
      )}

      {/* Image Challenge */}
      {challengeType === 'image' && (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-900 mb-4">
              {imageChallenge.prompt}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 9 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => toggleImage(idx)}
                className={`aspect-square rounded-xl border-4 transition-all ${
                  selectedImages.includes(idx)
                    ? 'border-blue-600 bg-blue-50 scale-95'
                    : 'border-gray-200 bg-gray-100 hover:border-gray-300'
                }`}
              >
                <div className="w-full h-full flex items-center justify-center text-4xl">
                  {idx % 3 === 0 ? '🏔️' : idx % 3 === 1 ? '🦁' : '🏖️'}
                </div>
              </button>
            ))}
          </div>

          <Button
            onClick={checkImages}
            disabled={selectedImages.length === 0}
            className="w-full h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300"
          >
            Verify Selection
          </Button>
        </div>
      )}

      {/* Pattern Challenge */}
      {challengeType === 'pattern' && (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-900 mb-4">
              {showPattern ? 'Memorize this pattern' : 'Recreate the pattern'}
            </p>
          </div>

          {/* Pattern Display */}
          <div className={`bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 transition-all ${
            showPattern ? 'opacity-100' : 'opacity-30'
          }`}>
            <div className="flex justify-center gap-3">
              {patternSequence.map((emoji, idx) => (
                <div
                  key={idx}
                  className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-3xl shadow-md"
                >
                  {showPattern ? emoji : '?'}
                </div>
              ))}
            </div>
          </div>

          {/* User Input */}
          {!showPattern && (
            <>
              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="flex justify-center gap-2 mb-4">
                  {Array.from({ length: patternSequence.length }).map((_, idx) => (
                    <div
                      key={idx}
                      className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-3xl shadow-md border-2 border-gray-200"
                    >
                      {userPattern[idx] || ''}
                    </div>
                  ))}
                </div>
              </div>

              {/* Animal Selection */}
              <div className="grid grid-cols-5 gap-2">
                {['🦁', '🐘', '🦒', '🦓', '🦏'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => addToPattern(emoji)}
                    disabled={userPattern.length >= patternSequence.length}
                    className="aspect-square bg-white rounded-xl border-2 border-gray-200 hover:border-blue-600 hover:bg-blue-50 transition-all text-3xl disabled:opacity-50"
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setUserPattern([])}
                  variant="outline"
                  className="flex-1 h-12 rounded-full border-2"
                >
                  Clear
                </Button>
                <Button
                  onClick={checkPattern}
                  disabled={userPattern.length !== patternSequence.length}
                  className="flex-1 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300"
                >
                  Submit
                </Button>
              </div>
            </>
          )}

          {showPattern && (
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-blue-600">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                <p className="text-sm font-semibold">Memorizing...</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Refresh Button */}
      <div className="mt-4 text-center">
        <button
          onClick={() => {
            resetChallenge();
            setAttempts(0);
            setFailed(false);
          }}
          className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-2 mx-auto"
        >
          <RefreshCw className="size-4" />
          Different challenge
        </button>
      </div>

      {/* Privacy Note */}
      <div className="mt-4 bg-gray-50 rounded-xl p-3">
        <p className="text-xs text-gray-600 text-center">
          🔒 This verification helps protect your account from bots and automated attacks
        </p>
      </div>
    </div>
  );
}
