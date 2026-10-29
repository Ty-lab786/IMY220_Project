import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, saveSession } from '../api.js';
import './AuthForm.css';

export default function SignupForm() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function validate() {
    const next = {};
    if (!form.username.trim()) next.username = 'Username is required.';
    else if (form.username.trim().length < 3) next.username = 'Username must be at least 3 characters.';
    if (!form.email.trim()) next.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Please enter a valid email.';
    if (form.password.length < 6) next.password = 'Password must be at least 6 characters.';
    if (form.confirm !== form.password) next.confirm = 'Passwords do not match.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSignup(e) {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await api('/auth/register', {
        method: 'POST',
        body: { username: form.username.trim(), email: form.email.trim(), password: form.password },
      });
      saveSession(data.token, data.user);
      navigate('/home');
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const fields = [
    { name: 'username', label: 'Username', type: 'text', placeholder: 'johndoe' },
    { name: 'email', label: 'Email address', type: 'email', placeholder: 'name@example.com' },
    { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
    { name: 'confirm', label: 'Confirm password', type: 'password', placeholder: '••••••••' },
  ];

  return (
    <form className="auth-form" onSubmit={handleSignup} noValidate>
      {serverError && <div className="auth-form__error">{serverError}</div>}

      {fields.map((f) => (
        <div className="field" key={f.name}>
          <label htmlFor={`signup-${f.name}`}>{f.label}</label>
          <input
            id={`signup-${f.name}`}
            name={f.name}
            type={f.type}
            value={form[f.name]}
            onChange={handleChange}
            placeholder={f.placeholder}
            className={errors[f.name] ? 'invalid' : ''}
          />
          {errors[f.name] && <p className="field-error">{errors[f.name]}</p>}
        </div>
      ))}

      <button type="submit" disabled={loading} className="btn btn-gold auth-form__submit">
        {loading ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  );
}