import { AbstractHandler } from './SecurityQuestionHandler';

export class ConcreteQuestionHandler extends AbstractHandler {
  private expectedQuestion: string;
  private expectedAnswer: string;

  constructor(expectedQuestion: string, expectedAnswer: string) {
    super();
    this.expectedQuestion = expectedQuestion;
    this.expectedAnswer = expectedAnswer.trim().toLowerCase(); // Normalize expected answer
  }

  handle(question: string, answer: string): boolean {
    const normalizedAnswer = answer.trim().toLowerCase(); // Normalize provided answer

    if (question === this.expectedQuestion) {
      if (normalizedAnswer === this.expectedAnswer) {
        console.log(`Correct answer for question: ${this.expectedQuestion}`);
        return super.handle(question, answer); // Continue to the next handler if correct
      } else {
        console.log(`Incorrect answer for question: ${this.expectedQuestion}`);
        return false; // Stop chain if incorrect
      }
    }

    // Pass to the next handler if the question doesn't match this handler's question
    return super.handle(question, answer);
  }
}
