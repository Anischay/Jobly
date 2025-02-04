import React, { useEffect, useState, useRef } from 'react';
import Typed from 'typed.js';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './IntroSequence.module.css';
import ChaoticNetwork from './visuals/ChaoticNetwork';
import SplitScreen from './visuals/SplitScreen';
import ShatteringInterface from './visuals/ShatteringInterface';
import ParticleNetwork from './visuals/ParticleNetwork';
import DNAStrands from './visuals/DNAStrands';
import MatrixLogo from './visuals/MatrixLogo';
import HolographicTransition from './visuals/HolographicTransition';

interface Props {
  onComplete: () => void;
}

interface NarrationSegment {
  text: string;
  visual: React.ReactNode;
}

const narrationScript: NarrationSegment[] = [
  {
    text: "In today's digital age, the job market has become a maze of endless applications and missed connections...",
    visual: <ChaoticNetwork />
  },
  {
    text: "Talented individuals are lost in a sea of opportunities, while companies struggle to find their perfect match...",
    visual: <SplitScreen />
  },
  {
    text: "The traditional hiring process is broken, fragmented, and increasingly inefficient...",
    visual: <ShatteringInterface />
  },
  {
    text: "But what if we could reshape this reality? What if AI could truly understand both talent and opportunity?",
    visual: <ParticleNetwork />
  },
  {
    text: "What if we could create perfect matches, not just based on keywords, but on true potential?",
    visual: <DNAStrands />
  },
  {
    text: "Welcome to Jobly - where we're not just changing how people find jobs...",
    visual: <MatrixLogo />
  },
  {
    text: "We're revolutionizing how careers are built.",
    visual: <HolographicTransition />
  }
];

const IntroSequence: React.FC<Props> = ({ onComplete }) => {
  const [currentSegment, setCurrentSegment] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const typedRef = useRef<Typed | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [typingComplete, setTypingComplete] = useState(false);
  const [speechComplete, setSpeechComplete] = useState(false);

  useEffect(() => {
    speechSynthesisRef.current = new SpeechSynthesisUtterance();
    speechSynthesisRef.current.rate = 0.8; // Slightly slower speech rate
    speechSynthesisRef.current.pitch = 1;
    speechSynthesisRef.current.volume = 1;

    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Daniel') || // Windows
        voice.name.includes('Google UK English Male') || // Chrome
        voice.name.includes('Alex') // MacOS
      );
      if (preferredVoice) {
        speechSynthesisRef.current!.voice = preferredVoice;
      }
    };

    setVoice();
    window.speechSynthesis.onvoiceschanged = setVoice;

    return () => {
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (typingComplete && speechComplete && currentSegment < narrationScript.length) {
      const timer = setTimeout(() => {
        if (currentSegment < narrationScript.length - 1) {
          setCurrentSegment(prev => prev + 1);
          setTypingComplete(false);
          setSpeechComplete(false);
        } else {
          setTimeout(onComplete, 3000); // Extended from 500ms to 3000ms
        }
      }, currentSegment === narrationScript.length - 1 ? 4000 : 500); // Longer duration for final segment

      return () => clearTimeout(timer);
    }
  }, [typingComplete, speechComplete, currentSegment, onComplete]);

  useEffect(() => {
    if (currentSegment < narrationScript.length) {
      window.speechSynthesis.cancel();
      setTypingComplete(false);
      setSpeechComplete(false);

      typedRef.current = new Typed('#typed-text', {
        strings: [narrationScript[currentSegment].text],
        typeSpeed: 35, // Slightly faster typing to match speech
        startDelay: 300, // Reduced delay for better sync
        showCursor: true,
        cursorChar: '_',
        onBegin: () => {
          setIsTyping(true);
          // Start speech immediately with typing
          if (speechSynthesisRef.current) {
            speechSynthesisRef.current.text = narrationScript[currentSegment].text;
            speechSynthesisRef.current.onend = () => {
              setSpeechComplete(true);
            };
            window.speechSynthesis.speak(speechSynthesisRef.current);
          }
        },
        onComplete: () => {
          setIsTyping(false);
          setTypingComplete(true);
        }
      });

      return () => {
        if (speechSynthesisRef.current) {
          speechSynthesisRef.current.onend = null;
          window.speechSynthesis.cancel();
        }
        typedRef.current?.destroy();
      };
    }
  }, [currentSegment]);

  return (
    <div className={styles.introContainer}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSegment}
          className={styles.visualContainer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {narrationScript[currentSegment].visual}
        </motion.div>
      </AnimatePresence>

      <div className={`${styles.textContainer} ${currentSegment === narrationScript.length - 1 ? styles.hideText : ''}`}>
        <span id="typed-text" className={styles.typedText}></span>
      </div>

      <button 
        className={styles.skipButton}
        onClick={onComplete}
      >
        Skip Intro
      </button>
    </div>
  );
};

export default IntroSequence;
