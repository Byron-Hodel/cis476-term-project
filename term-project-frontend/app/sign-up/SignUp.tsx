import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
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

export default function SignUp(props: { disableCustomTheme?: boolean }) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');
  const [securityAnswers, setSecurityAnswers] = React.useState<string[]>(['','','']);
  // State variables for security question errors
  const [securityErrors, setSecurityErrors] = React.useState([false, false, false]);
  const [securityErrorMessages, setSecurityErrorMessages] = React.useState([
    '',
    '',
    '',
  ]);

  const handleSecurityAnswerChange = (index: number, value: string) => {
    setSecurityAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[index] = value;
      return newAnswers;
    });
  };

  const validateInputs = () => {
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;
    const name = document.getElementById('name') as HTMLInputElement;

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (nameError || emailError || passwordError) {
      event.preventDefault();
      return;
    }
    const data = new FormData(event.currentTarget);
    console.log({
      name: data.get('name'),
      lastName: data.get('lastName'),
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  return (
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
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
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
  
            {/* Security Question 1 */}
            <FormControl fullWidth error={securityErrors[0]}>
              <FormLabel htmlFor="security-question-1">Security Question 1</FormLabel>
              <Select id="security-question-1" name="securityQuestion1" defaultValue="" required>
                <MenuItem value="">Select a question</MenuItem>
                <MenuItem value="What is your mother's maiden name?">What is your mother's maiden name?</MenuItem>
                <MenuItem value="What was the name of your first pet?">What was the name of your first pet?</MenuItem>
                <MenuItem value="What was your first school?">What was your first school?</MenuItem>
              </Select>
              <TextField
                fullWidth
                placeholder="Answer"
                error={securityErrors[0]}
                helperText={securityErrorMessages[0]}
                onChange={(e) => handleSecurityAnswerChange(0, e.target.value)}
              />
            </FormControl>

            {/* Security Question 2 */}
            <FormControl fullWidth error={securityErrors[1]}>
              <FormLabel htmlFor="security-question-2">Security Question 2</FormLabel>
              <Select id="security-question-2" name="securityQuestion2" defaultValue="" required>
                <MenuItem value="">Select a question</MenuItem>
                <MenuItem value="What is your mother's maiden name?">What is your mother's maiden name?</MenuItem>
                <MenuItem value="What was the name of your first pet?">What was the name of your first pet?</MenuItem>
                <MenuItem value="What was your first school?">What was your first school?</MenuItem>
              </Select>
              <TextField
                fullWidth
                placeholder="Answer"
                error={securityErrors[1]}
                helperText={securityErrorMessages[1]}
                onChange={(e) => handleSecurityAnswerChange(1, e.target.value)}
              />
            </FormControl>

            {/* Security Question 3 */}
            <FormControl fullWidth error={securityErrors[2]}>
              <FormLabel htmlFor="security-question-3">Security Question 3</FormLabel>
              <Select id="security-question-3" name="securityQuestion3" defaultValue="" required>
                <MenuItem value="">Select a question</MenuItem>
                <MenuItem value="What is your mother's maiden name?">What is your mother's maiden name?</MenuItem>
                <MenuItem value="What was the name of your first pet?">What was the name of your first pet?</MenuItem>
                <MenuItem value="What was your first school?">What was your first school?</MenuItem>
              </Select>
              <TextField
                fullWidth
                placeholder="Answer"
                error={securityErrors[2]}
                helperText={securityErrorMessages[2]}
                onChange={(e) => handleSecurityAnswerChange(2, e.target.value)}
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
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
  );
  
}
