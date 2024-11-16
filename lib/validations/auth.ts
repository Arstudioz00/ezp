export const validateAuthInput = (username: string, password: string) => {
  const errors: string[] = [];
  
  if (!username || username.length < 3) {
    errors.push('Username must be at least 3 characters');
  }
  
  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }
  
  return errors;
}; 