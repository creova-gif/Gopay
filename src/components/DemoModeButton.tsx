import { Button } from './ui/button';
import { Zap, Sparkles } from 'lucide-react';

interface DemoModeButtonProps {
  onDemoStart: () => void;
}

export function DemoModeButton({ onDemoStart }: DemoModeButtonProps) {
  return (
    <div className="mt-6 p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-300">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="size-5 text-yellow-600" />
        <h3 className="font-semibold text-yellow-900">Try Demo Mode</h3>
      </div>
      <p className="text-sm text-yellow-700 mb-3">
        Experience all goPay features instantly without signing up!
      </p>
      <Button
        onClick={onDemoStart}
        className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
      >
        <Zap className="size-4 mr-2" />
        Start Demo with TZS 100,000
      </Button>
    </div>
  );
}
