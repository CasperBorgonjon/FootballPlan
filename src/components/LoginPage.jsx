import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (isSignUp) {
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        setLoading(false);
        return;
      }
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setSuccess('Account created! You are now signed in.');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message.includes('Invalid login') ? 'Wrong email or password.' : error.message);
    }

    setLoading(false);
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-eyebrow">Fullback · Off-Season</div>
        <h1 className="login-title">
          Soccer — <em>complete plan</em>
        </h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-toggle">
            <button
              type="button"
              className={!isSignUp ? 'active' : ''}
              onClick={() => { setIsSignUp(false); setError(''); setSuccess(''); }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={isSignUp ? 'active' : ''}
              onClick={() => { setIsSignUp(true); setError(''); setSuccess(''); }}
            >
              Sign Up
            </button>
          </div>

          <input
            className="login-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="login-input"
            type="password"
            placeholder="Password (min. 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <div className="login-message login-message--error">
              <span>⚠</span> {error}
            </div>
          )}
          {success && (
            <div className="login-message login-message--success">
              <span>✓</span> {success}
            </div>
          )}

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? '…' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>

          {isSignUp && !success && (
            <div className="login-hint">
              After signing up you'll be logged in automatically. Your workout progress syncs across all your devices.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
