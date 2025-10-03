'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BlurText from './BlurText';
import ShinyText from './ShinyText';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

interface ProcessingAnimationProps {
  aiProcessingTime: number;
  portfolioSlug: string;
  onComplete?: () => void;
}

export default function ProcessingAnimation({ aiProcessingTime, portfolioSlug, onComplete }: ProcessingAnimationProps) {
  const [stage, setStage] = useState(1);
  const [isBlurring, setIsBlurring] = useState(false);

  useEffect(() => {
    // Stage 1: "Isn't this so cool?!" - show for 3 seconds
    const timer1 = setTimeout(() => {
      setIsBlurring(true);
      setTimeout(() => {
        setStage(2);
        setIsBlurring(false);
      }, 300);
    }, 3000);
    
    // Stage 2: "built with cerebras" - show for 3 seconds
    const timer2 = setTimeout(() => {
      setIsBlurring(true);
      setTimeout(() => {
        setStage(3);
        setIsBlurring(false);
      }, 300);
    }, 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleViewPortfolio = () => {
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center overflow-hidden">
      {/* Blur overlay for transitions */}
      <div 
        className={`absolute inset-0 backdrop-blur-xl bg-black/50 transition-opacity duration-500 z-10 pointer-events-none ${
          isBlurring ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Content container - always centered */}
      <div className="relative z-20 flex items-center justify-center w-full h-full">
        <AnimatePresence mode="wait">
          {/* Stage 1: "Isn't this so cool?!" */}
          {stage === 1 && (
            <motion.div
              key="stage-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <BlurText
                text="Isn't this so cool?!"
                delay={50}
                animateBy="words"
                direction="top"
                className="text-5xl md:text-6xl font-bold text-white"
              />
            </motion.div>
          )}

          {/* Stage 2: "built with cerebras" */}
          {stage === 2 && (
            <motion.div
              key="stage-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <BlurText
                text="built with cerebras"
                delay={50}
                animateBy="words"
                direction="top"
                className="text-4xl md:text-5xl font-bold text-purple-400"
              />
            </motion.div>
          )}

          {/* Stage 3: "Live in just X seconds with Cerebras" with button */}
          {stage === 3 && (
            <motion.div
              key="stage-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center flex flex-col items-center gap-8"
            >
              <div className="space-y-4 flex flex-col items-center">
                <BlurText
                  text="Live in just"
                  delay={50}
                  animateBy="words"
                  direction="top"
                  className="text-3xl md:text-4xl text-gray-300"
                />
                
                {/* Only the number is shiny - center of attention */}
                <ShinyText
                  text={aiProcessingTime.toFixed(2)}
                  disabled={false}
                  speed={5}
                  className="text-8xl md:text-9xl font-bold"
                />
                
                {/* "seconds" on new line */}
                <div className="text-3xl md:text-4xl text-gray-400">
                  <span>seconds</span>
                </div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col items-center gap-4"
              >
                <Button
                  onClick={handleViewPortfolio}
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6 border-2 border-white/20 bg-transparent hover:bg-white/5 transition-all duration-300"
                >
                  <ShinyText
                    text="View Portfolio"
                    disabled={false}
                    speed={5}
                    className="text-base font-semibold"
                  />
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                
                {/* Cerebras branding below button */}
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span>⚡️ Supercharged by</span>
                  <img 
                    src="/cerebras.png" 
                    alt="Cerebras" 
                    className="h-8 md:h-10 object-contain"
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
