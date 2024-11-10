import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { ConcreteQuestionHandler } from './handlers/ConcreteQuestionHandler';
import { useRouter } from 'next/navigation';
import SessionManager from '../utils/SessionManager';

interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}

export default function ForgotPassword({ open, handleClose }: ForgotPasswordProps) {
  const [email, setEmail] = React.useState('');
  const [questions, setQuestions] = React.useState<string[]>([]);
  const [answers, setAnswers] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [newPassword, setNewPassword] = React.useState<string>('');
  const [showPasswordChange, setShowPasswordChange] = React.useState(false);
  const router = useRouter();

  // Function to handle fetching security questions by email
  const handleEmailSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('http://localhost:4000/api/users/get-security-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch security questions');
      }

      const data = await response.json();
      setQuestions(data.questions.map((q: { question: string }) => q.question));
      setAnswers(new Array(data.questions.length).fill(''));
    } catch (err) {
      setError('Unable to fetch security questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle answer change for each question
  const handleAnswerChange = (index: number, value: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  // Function to handle form submission and use the chain of responsibility for verification
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    // Create handler chain
    const handler1 = new ConcreteQuestionHandler(questions[0], answers[0]);
    const handler2 = new ConcreteQuestionHandler(questions[1], answers[1]);
    const handler3 = new ConcreteQuestionHandler(questions[2], answers[2]);

    handler1.setNext(handler2).setNext(handler3);

    // Verify each answer using the chain
    const allCorrect = handler1.handle(questions[0], answers[0]);
    if (allCorrect) {
      // If all answers are correct, send them to the backend for final verification
      try {
        const requestBody = {
          email,
          answers: questions.map((question, index) => ({
            question,
            answer: answers[index],
          })),
        };

        const response = await fetch('http://localhost:4000/api/users/verify-security-answers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error('Verification failed');
        }

        const data = await response.json();
        setSuccess(data.message);
        setShowPasswordChange(true);
      } catch (err) {
        setError('Verification failed. Please check your answers and try again.');
      } finally {
        setLoading(false);
      }
    } else {
      setError('Some answers are incorrect. Please try again.');
      setLoading(false);
    }
  };

  // Function to handle changing the password and auto-signing in
  const handlePasswordChange = async () => {
    if (!newPassword) {
      setError('Please enter a new password.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:4000/api/users/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });

      if (!response.ok) {
        throw new Error('Password change failed');
      }

      const data = await response.json();
      setSuccess(data.message);

      // Sign the user in after password change
      try {
        const signInResponse = await fetch('http://localhost:4000/api/users/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password: newPassword }),
        });

        if (!signInResponse.ok) {
          throw new Error('Sign-in failed after password change');
        }

        const signInData = await signInResponse.json();
        const { token, user } = signInData;

        // Store the token and user data in SessionManager
        const session = SessionManager.getInstance();
        session.setToken(token);
        session.setUser(user);

        // Navigate to the dashboard after a short delay
        setSuccess('Password changed successfully. Signing in...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } catch (err) {
        setError('Sign-in failed. Please try logging in manually.');
      }
    } catch (err) {
      setError('Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Reset Password</DialogTitle>
      <DialogContent>
        {!questions.length && !showPasswordChange ? (
          <>
            <DialogContentText>
              Enter your email to receive security questions for verification.
            </DialogContentText>
            <OutlinedInput
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              fullWidth
              required
            />
            <Button onClick={handleEmailSubmit} disabled={!email || loading} fullWidth>
              {loading ? <CircularProgress size={24} /> : 'Get Security Questions'}
            </Button>
          </>
        ) : showPasswordChange ? (
          <>
            <DialogContentText>
              Your answers have been verified. Please enter a new password.
            </DialogContentText>
            <OutlinedInput
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              fullWidth
              required
            />
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
          </>
        ) : (
          <>
            {questions.map((question, index) => (
              <div key={index}>
                <DialogContentText>{question}</DialogContentText>
                <OutlinedInput
                  value={answers[index] || ''}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  placeholder="Your answer"
                  fullWidth
                  required
                />
              </div>
            ))}
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>Cancel</Button>
        {!showPasswordChange ? (
          <Button onClick={handleSubmit} variant="contained" disabled={loading || answers.includes('')}>
            {loading ? <CircularProgress size={24} /> : 'Submit Answers'}
          </Button>
        ) : (
          <Button onClick={handlePasswordChange} variant="contained" disabled={loading || !newPassword}>
            {loading ? <CircularProgress size={24} /> : 'Change Password'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
