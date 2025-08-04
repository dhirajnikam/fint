const ERROR_MESSAGES = {
  'auth/user-not-found': 'No user found with this email.',
  'auth/wrong-password': 'Incorrect password.',
  'auth/email-already-in-use': 'Email is already in use.',
  'auth/weak-password': 'Password should be at least 6 characters.',
  'auth/invalid-email': 'Invalid email address.',
  'auth/too-many-requests': 'Too many requests. Please try again later.',
};

export default function mapError(error) {
  if (!error) {
    return 'An unexpected error occurred. Please try again.';
  }
  return ERROR_MESSAGES[error.code] || 'An unexpected error occurred. Please try again.';
}
