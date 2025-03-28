/**
 * @file TestComponent.tsx
 * @description Component for displaying and taking tests
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { Test, Question } from '@/types';

interface TestComponentProps {
  test: Test;
  isCompleted: boolean;
  onCompleted: (score: number) => void;
}

/**
 * TestComponent
 * 
 * Displays a test with questions and handles scoring
 */
export function TestComponent({ test, isCompleted, onCompleted }: TestComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(
    Array(test.questions.length).fill(-1)
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  
  // Get current question
  const question = test.questions[currentQuestion];
  
  // Handle option selection
  const selectOption = (optionIndex: number) => {
    if (isSubmitted) return;
    
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = optionIndex;
    setSelectedAnswers(newAnswers);
  };
  
  // Navigate to next question
  const nextQuestion = () => {
    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  
  // Navigate to previous question
  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  // Submit the test
  const submitTest = () => {
    // Calculate score
    let correctAnswers = 0;
    test.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const finalScore = Math.round((correctAnswers / test.questions.length) * 100);
    setScore(finalScore);
    setIsSubmitted(true);
    onCompleted(finalScore);
  };
  
  // If test is already completed, show summary
  if (isCompleted) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">Test Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            <div className="bg-green-100 text-green-800 p-4 rounded-full">
              <Check className="w-8 h-8" />
            </div>
          </div>
          <p className="text-center">You've already completed this test.</p>
        </CardContent>
      </Card>
    );
  }
  
  // If test is submitted, show results
  if (isSubmitted) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <div className="text-3xl font-bold">{score}%</div>
            <p className="text-gray-500">
              ({test.questions.filter((q, i) => 
                selectedAnswers[i] === q.correctAnswer
              ).length} of {test.questions.length} correct)
            </p>
          </div>
          
          <div className="space-y-4">
            {test.questions.map((q, qIndex) => {
              const isCorrect = selectedAnswers[qIndex] === q.correctAnswer;
              
              return (
                <div 
                  key={q.id}
                  className={`p-3 rounded-lg ${
                    isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  } border`}
                >
                  <div className="flex items-start">
                    <div className={`shrink-0 mr-2 ${
                      isCorrect ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {isCorrect ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-medium">{q.text}</p>
                      <p className="text-sm">
                        Your answer: {selectedAnswers[qIndex] >= 0 ? 
                          q.options[selectedAnswers[qIndex]] : 'None'}
                      </p>
                      {!isCorrect && (
                        <p className="text-sm mt-1 text-green-700">
                          Correct answer: {q.options[q.correctAnswer]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Display current question
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Test Your Knowledge</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Question {currentQuestion + 1} of {test.questions.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-teal-500 h-1.5 rounded-full" 
              style={{ width: `${((currentQuestion + 1) / test.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">{question.text}</h3>
          
          <div className="space-y-2">
            {question.options.map((option, optionIndex) => (
              <div
                key={optionIndex}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedAnswers[currentQuestion] === optionIndex
                    ? 'bg-teal-50 border-teal-300'
                    : 'hover:bg-gray-50 border-gray-200'
                }`}
                onClick={() => selectOption(optionIndex)}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={previousQuestion}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        
        <div>
          {currentQuestion === test.questions.length - 1 ? (
            <Button
              onClick={submitTest}
              disabled={selectedAnswers.some(a => a === -1)}
            >
              Submit
            </Button>
          ) : (
            <Button
              onClick={nextQuestion}
              disabled={selectedAnswers[currentQuestion] === -1}
            >
              Next
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
} 