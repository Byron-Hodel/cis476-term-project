// Interface defining the structure of a handler
export interface SecurityQuestionHandler {
    setNext(handler: SecurityQuestionHandler): SecurityQuestionHandler;
    handle(question: string, answer: string): boolean;
  }
  
  // Base abstract class implementing the common logic for handlers
  export abstract class AbstractHandler implements SecurityQuestionHandler {
    private nextHandler: SecurityQuestionHandler | null = null;
  
    // Method to set the next handler in the chain
    setNext(handler: SecurityQuestionHandler): SecurityQuestionHandler {
      this.nextHandler = handler;
      return handler;
    }
  
    // Method to handle the question and answer, passing to the next handler if necessary
    handle(question: string, answer: string): boolean {
      if (this.nextHandler) {
        return this.nextHandler.handle(question, answer);
      }
      // If no next handler, return true (end of chain)
      return true;
    }
  }
  