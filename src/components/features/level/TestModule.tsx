/**
 * @file TestModule.tsx
 * @description Component for displaying and taking tests
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, AlertTriangle } from 'lucide-react';
import { Test, Question } from '@/types';

interface TestModuleProps {
  test: Test;
  isCompleted: boolean;
  onTestComplete: (score: number) => void;
}

/**
 * TestModule
 * 
 * Displays a test with questions and handles scoring
 */
export function TestModule({ test, isCompleted, onTestComplete }: TestModuleProps) {
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
    onTestComplete(finalScore);
  };
  
  // If test is already completed, show summary
  if (isCompleted) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-green-600">
            <Check className="w-5 h-5" />
            Тест пройден
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Вы успешно прошли этот тест. Вы можете продолжить обучение.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // If test is submitted, show results
  if (isSubmitted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Результаты теста</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-lg">
            <div className="text-4xl font-bold mb-2">{score}%</div>
            <p className="text-muted-foreground">
              {test.questions.filter((q, i) => 
                selectedAnswers[i] === q.correctAnswer
              ).length} из {test.questions.length} правильных ответов
            </p>
          </div>
          
          <div className="space-y-3">
            {test.questions.map((q, qIndex) => {
              const isCorrect = selectedAnswers[qIndex] === q.correctAnswer;
              
              return (
                <div 
                  key={q.id}
                  className={`p-3 rounded-lg border ${
                    isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex gap-3">
                    <div className={`shrink-0 ${
                      isCorrect ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {isCorrect ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-medium">{q.text}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Ваш ответ: {selectedAnswers[qIndex] >= 0 ? 
                          q.options[selectedAnswers[qIndex]] : 'Нет ответа'}
                      </p>
                      {!isCorrect && (
                        <p className="text-sm mt-1 text-green-600 font-medium">
                          Правильный ответ: {q.options[q.correctAnswer]}
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
    <Card>
      <CardHeader>
        <CardTitle>Проверьте свои знания</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Вопрос {currentQuestion + 1} из {test.questions.length}</span>
            <span>{Math.round(((currentQuestion + 1) / test.questions.length) * 100)}% выполнено</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full" 
              style={{ width: `${((currentQuestion + 1) / test.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">{question.text}</h3>
          
          <div className="space-y-2">
            {question.options.map((option, optionIndex) => (
              <div
                key={optionIndex}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedAnswers[currentQuestion] === optionIndex
                    ? 'bg-primary/10 border-primary/20'
                    : 'hover:bg-muted border-input'
                }`}
                onClick={() => selectOption(optionIndex)}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
        
        {selectedAnswers[currentQuestion] === -1 && (
          <div className="text-amber-600 flex items-center gap-2 text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Выберите один из вариантов ответа</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={previousQuestion}
          disabled={currentQuestion === 0}
        >
          Назад
        </Button>
        
        <div>
          {currentQuestion === test.questions.length - 1 ? (
            <Button
              onClick={submitTest}
              disabled={selectedAnswers.some(a => a === -1)}
            >
              Завершить тест
            </Button>
          ) : (
            <Button
              onClick={nextQuestion}
              disabled={selectedAnswers[currentQuestion] === -1}
            >
              Далее
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
} 