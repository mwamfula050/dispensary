
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  HeartPulse,
  ShieldCheck,
  Activity,
  Languages,
  ArrowUpRight,
  Eye,
  EyeOff,
  LockKeyhole,
  UserRound,
  Sparkles,
} from 'lucide-react';

import { api } from '../api';
import type { User } from '../types';

export default function LoginPage({
  onLogin,
}: {
  onLogin: (u: User) => void;
}) {
  const { t } = useTranslation();

  const [username, setUsername] = useState(
    () => localStorage.getItem('mediflow-remembered-user') || ''
  );

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [remember, setRemember] = useState(
    !!localStorage.getItem('mediflow-remembered-user')
  );

  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    setBusy(true);
    setError('');

    try {
      const response = await api.post('/auth/login', {
        username: username.trim(),
        password,
      });

      const data = response.data;

      // Verify that the backend returned a token.
      if (!data || !data.token || typeof data.token !== 'string') {
        throw new Error('Backend did not return a valid authentication token.');
      }

      // Save authentication token.
      localStorage.setItem('mediflow-token', data.token);

      // Verify that the token was saved.
      const savedToken = localStorage.getItem('mediflow-token');

      if (!savedToken) {
        throw new Error('Unable to save authentication token.');
      }

      // Remember username if requested.
      if (remember) {
        localStorage.setItem(
          'mediflow-remembered-user',
          username.trim()
        );
      } else {
        localStorage.removeItem('mediflow-remembered-user');
      }

      // Save logged-in user details.
      const user: User = {
        username: data.username,
        fullName: data.fullName,
        role: data.role,
      };

      localStorage.setItem('mediflow-user', JSON.stringify(user));

      console.info('MEDIFLOW: Login successful. Token saved.');

      // Notify the main application.
      onLogin(user);

    } catch (e: any) {
      console.error('MEDIFLOW login error:', e);

      const status = e?.response?.status;

      if (status === 401) {
        setError(
          'Incorrect username or password, or your account is disabled.'
        );
      } else if (status === 403) {
        setError(
          'Your account is not permitted to sign in. Contact the administrator.'
        );
      } else if (e?.message?.includes('token')) {
        setError(e.message);
      } else if (e?.response) {
        setError(
          `Login failed. Server returned status ${status || 'unknown'}.`
        );
      } else {
        setError(
          'Unable to connect to MEDIFLOW. Check that the backend and database are running.'
        );
      }

    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-art">
        <div className="brand large">
          <div className="brand-mark">
            <HeartPulse />
          </div>
          <div>
            <b>MEDIFLOW</b>
            <small>INTEGRATED DISPENSARY MANAGEMENT</small>
          </div>
        </div>

        <div className="health-orbit orbit-a" />
        <div className="health-orbit orbit-b" />

        <div className="art-copy">
          <span className="eyebrow">
            <Sparkles size={14} /> CONNECTED CARE. CONFIDENT DECISIONS.
          </span>

          <h1>
            Better care begins
            <br />
            <em>with every connection.</em>
          </h1>

          <p>
            A secure clinical workspace connecting reception, nursing,
            doctors, laboratory, pharmacy and finance around one patient record.
          </p>

          <div className="art-stats">
            <span><ShieldCheck /> Secure staff access</span>
            <span><Activity /> Connected workflow</span>
            <span><Languages /> EN · SW · AR</span>
          </div>
        </div>

        <div className="heartbeat-panel" aria-hidden="true">
          <span />
          <HeartPulse size={28} />
          <small>CARE NETWORK ACTIVE</small>
        </div>

        <div className="art-footer">
          MEDIFLOW HEALTH SYSTEMS <span>•</span> BUILT FOR BETTER CARE
        </div>
      </section>

      <section className="login-panel">
        <form onSubmit={submit}>
          <div className="mobile-brand">
            <HeartPulse /> MEDIFLOW
          </div>

          <span className="eyebrow">STAFF PORTAL</span>

          <h2>{t('signIn')}</h2>

          <p>
            Sign in with the account assigned by your system administrator.
          </p>

          <label htmlFor="username">Username</label>

          <div className="input-with-icon">
            <UserRound size={17} />

            <input
              id="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
              required
              placeholder="Enter your username"
            />
          </div>

          <label htmlFor="password">Password</label>

          <div className="input-with-icon password-input">
            <LockKeyhole size={17} />

            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              placeholder="Enter your password"
            />

            <button
              type="button"
              className="password-toggle"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword(v => !v)}
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>

          <label className="remember-row">
            <input
              type="checkbox"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
            />
            Remember username on this device
          </label>

          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          <button
            className="primary full login-submit"
            disabled={busy}
          >
            {busy ? (
              <>
                <span className="spinner" />
                Signing in securely…
              </>
            ) : (
              <>
                Sign in to MEDIFLOW
                <ArrowUpRight size={18} />
              </>
            )}
          </button>

          <small className="login-foot">
            <ShieldCheck size={14} />
            Access is monitored and restricted by your assigned role.
          </small>
        </form>
      </section>
    </main>
  );
}
