/**
 * This file defines a SignUp component for user registration.
 * It includes a form with validation, dynamic security questions, and error handling.
 * Material-UI components are used for styling and functionality.
*/
'use client';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';
import { MenuItem, Select } from '@mui/material';
import axios from 'axios'; // used for sending info to the backend
import CheckIcon from '@mui/icons-material/Check';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

// Styled Material-UI Card with custom properties
const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  overflowY: 'auto', // Enable scrolling
  // Hide the scrollbar
  '::-webkit-scrollbar': {
    display: 'none', // For Chrome, Safari, and Opera
  },
  msOverflowStyle: 'none', // For Internet Explorer and Edge
  scrollbarWidth: 'none', // For Firefox
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

// Container for the sign-up form with responsive layout and styles
const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  overflowY: 'auto', // Ensure scrolling is enabled
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

/**
 * SignUp Component
 * Handles user registration including form validation, security questions, and API submission.
*/
export default function SignUp(props: { disableCustomTheme?: boolean }) {
  // State management for form and error handling
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');
  const [securityAnswers, setSecurityAnswers] = React.useState<string[]>(['', '', '']);
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');
  const [alertSeverity, setAlertSeverity] = React.useState<'success' | 'error' | 'warning'>('success');
  const [securityErrors, setSecurityErrors] = React.useState([false, false, false]);
  const [securityErrorMessages, setSecurityErrorMessages] = React.useState(['', '', '']);
  const router = useRouter(); // For navigation between pages

  // List of all security questions
  const securityQuestions = [
    "What is your mother's maiden name?",
    "What was the name of your first pet?",
    "What was your first school?",
    "What is your favorite book?",
    "What was the make of your first car?",
    "What is your favorite movie?",
  ];

  const [selectedQuestions, setSelectedQuestions] = React.useState<string[]>(['', '', '']);

  // Handles selection of security questions dynamically
  const handleSecurityQuestionChange = (index: number, value: string) => {
    setSelectedQuestions((prev) => {
      const updatedQuestions = [...prev];
      updatedQuestions[index] = value;
      return updatedQuestions;
    });
  };

  // Filters options dynamically to exclude already selected questions
  const getFilteredOptions = (index: number) => {
    return securityQuestions.filter(
      (question) => !selectedQuestions.includes(question) || selectedQuestions[index] === question
    );
  };

  // Close alert notification
  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  // Update security answers dynamically
  const handleSecurityAnswerChange = (index: number, value: string) => {
    setSecurityAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[index] = value;
      return newAnswers;
    });
  };

  /**
   * Validates user inputs including email, password, and security answers.
   * Updates error states and returns true if all inputs are valid.
  */
  const validateInputs = () => {
    // Input elements for validation
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;
    const name = document.getElementById('name') as HTMLInputElement;

    let isValid = true;

    // Email validation
    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    // Password validation
    const passwordValue = password.value;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordValue || !passwordRegex.test(passwordValue)) {
      setPasswordError(true);
      setPasswordErrorMessage(
        'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.'
      );
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    // Weak password warning
    const weakPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/; // Lacks special character
    if (passwordValue && weakPasswordRegex.test(passwordValue) && !passwordRegex.test(passwordValue)) {
      setAlertMessage(
        'Your password is strong but could be improved by adding a special character.'
      );
      setAlertSeverity('warning');
      setAlertOpen(true);
    }

    // Name validation
    if (!name.value || name.value.length < 1) {
      setNameError(true);
      setNameErrorMessage('Name is required.');
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }

    // Validate security question answers
    const newSecurityErrors = [false, false, false];
    const newSecurityErrorMessages = ['', '', ''];

    securityAnswers.forEach((answer, index) => {
      if (!answer) {
        newSecurityErrors[index] = true;
        newSecurityErrorMessages[index] = `Answer for security question ${index + 1} is required.`;
        isValid = false;
      }
    });

    setSecurityErrors(newSecurityErrors);
    setSecurityErrorMessages(newSecurityErrorMessages);

    return isValid;
  };

  /**
   * Handles form submission.
   * Validates inputs, sends data to the backend API, and displays success or error messages.
  */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default values from being sent

    if (!validateInputs()) {
      event.preventDefault();
      return;
    }

    const data = new FormData(event.currentTarget);

    // Prepare form data for API reques
    const formData = {
      name: data.get('name'),
      email: data.get('email'),
      password: data.get('password'),
      securityQuestion1: selectedQuestions[0],
      securityAnswer1: securityAnswers[0],
      securityQuestion2: selectedQuestions[1],
      securityAnswer2: securityAnswers[1],
      securityQuestion3: selectedQuestions[2],
      securityAnswer3: securityAnswers[2],
    };

    try {
      // Send form data to the backend API
      console.log('Form data before sending: ', formData);
      const response = await axios.post('http://localhost:4000/api/users/signup', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // On success, show success message and redirect to sign-in page
      console.log('Sign-up successful:', response.data);
      setAlertMessage('Sign-up successful.');
      setAlertSeverity('success');
      setAlertOpen(true);
      // Navigate to sign-in page after success
      setTimeout(() => {
        router.push('/sign-in');
      }, 2000);
    } catch (error) {
      // On error, show failure message
      console.error('Error submitting the form:', error);
      setAlertMessage('Sign-up failed. Please try again.');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  return (
    <>
      {/* Theme and layout setup */}
      <AppTheme {...props}>
        <CssBaseline enableColorScheme />
        <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
        <SignUpContainer direction="column" justifyContent="space-between">
          <Card variant="outlined">
            <Typography
              component="h1"
              variant="h4"
              sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
            >
              Sign up
            </Typography>
            {/* Form with input fields and submission handling */}
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              {/* Name input */}
              <FormControl>
                <FormLabel htmlFor="name">Full name</FormLabel>
                <TextField
                  autoComplete="name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  placeholder="Jon Snow"
                  error={nameError}
                  helperText={nameErrorMessage}
                  color={nameError ? 'error' : 'primary'}
                />
              </FormControl>
              {/* Email input */}
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <TextField
                  required
                  fullWidth
                  id="email"
                  placeholder="your@email.com"
                  name="email"
                  autoComplete="email"
                  variant="outlined"
                  error={emailError}
                  helperText={emailErrorMessage}
                  color={passwordError ? 'error' : 'primary'}
                />
              </FormControl>
              {/* Password input */}
              <FormControl>
                <FormLabel htmlFor="password">Password</FormLabel>
                <TextField
                  required
                  fullWidth
                  name="password"
                  placeholder="••••••"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  variant="outlined"
                  error={passwordError}
                  helperText={passwordErrorMessage}
                  color={passwordError ? 'error' : 'primary'}
                />
              </FormControl>
              {/* Security questions and answers */}
              {[...Array(3)].map((_, i) => (
                <FormControl key={i} fullWidth error={securityErrors[i]}>
                  <FormLabel htmlFor={`security-question-${i + 1}`}>
                    Security Question {i + 1}
                  </FormLabel>
                  <Select
                    id={`security-question-${i + 1}`}
                    name={`securityQuestion${i + 1}`}
                    value={selectedQuestions[i]}
                    onChange={(e) => handleSecurityQuestionChange(i, e.target.value)}
                    required
                  >
                    <MenuItem value="">Select a question</MenuItem>
                    {getFilteredOptions(i).map((option, idx) => (
                      <MenuItem key={idx} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  <TextField
                    fullWidth
                    placeholder="Answer"
                    error={securityErrors[i]}
                    helperText={securityErrorMessages[i]}
                    onChange={(e) => handleSecurityAnswerChange(i, e.target.value)}
                  />
                </FormControl>
              ))}
              <Button type="submit" fullWidth variant="contained">
                Sign up
              </Button>
              <Typography sx={{ textAlign: 'center' }}>
                Already have an account?{' '}
                <span>
                  <Link href="/sign-in" variant="body2" sx={{ alignSelf: 'center' }}>
                    Sign in
                  </Link>
                </span>
              </Typography>
            </Box>
          </Card>
        </SignUpContainer>
      </AppTheme>
      {/* Snackbar for notifications */}
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleAlertClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleAlertClose} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
