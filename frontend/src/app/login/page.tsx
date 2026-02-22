import React, { useState } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';

const LoginPage = () => {
  const { login } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Login</button>
      <Link href="/register">Register</Link>
    </form>
  );
};

export default LoginPage;