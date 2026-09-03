import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const emptyErrors = { username: '', email: '', password: '', confirmPassword: '' };

export default function SignupForm() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState(emptyErrors);
    const [status, setStatus] = useState({ loading: false, message: '' });

    function validate(values) {
        const nextErrors = { ...emptyErrors };
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!values.username.trim()) {
            nextErrors.username = 'Username is required.';
        } else if (values.username.trim().length < 3) {
            nextErrors.username = 'Username must be at least 3 characters.';
        }

        if (!values.email.trim()) {
            nextErrors.email = 'Email address is required.';
        } else if (!emailPattern.test(values.email)) {
            nextErrors.email = 'Enter a valid email address.';
        }

        if (!values.password) {
            nextErrors.password = 'Password is required.';
        } else if (values.password.length < 6) {
            nextErrors.password = 'Password must be at least 6 characters.';
        }

        if (!values.confirmPassword) {
            nextErrors.confirmPassword = 'Please confirm your password.';
        } else if (values.confirmPassword !== values.password) {
            nextErrors.confirmPassword = 'Passwords do not match.';
        }

        setErrors(nextErrors);
        return Object.values(nextErrors).every((message) => !message);
    }

    function handleChange(event) {
        const { name, value } = event.target;
        const next = { ...form, [name]: value };
        setForm(next);
        validate(next);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (!validate(form)) return;

        setStatus({ loading: true, message: '' });
        try {
            const response = await fetch(`${API_BASE}/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: form.username,
                    email: form.email,
                    password: form.password,
                }),
            });
            const data = await response.json();

            if (!response.ok || !data.success) {
                setStatus({ loading: false, message: data.message || 'Sign up failed.' });
                return;
            }

            setStatus({ loading: false, message: 'Account created. Redirecting...' });
            navigate('/home');
        } catch (error) {
            setStatus({
                loading: false,
                message: 'Could not reach the server. Is the backend running?',
            });
        }
    }

    const isValid =
        form.username.trim().length >= 3 &&
        form.email.trim() &&
        form.password.length >= 6 &&
        form.confirmPassword === form.password;

    return (
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="field">
                <label htmlFor="signup-username">Username</label>
                <input
                    id="signup-username"
                    name="username"
                    type="text"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="taushir_s"
                    className={errors.username ? 'invalid' : ''}
                />
                {errors.username && <p className="field-error">{errors.username}</p>}
            </div>

            <div className="field">
                <label htmlFor="signup-email">Email address</label>
                <input
                    id="signup-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={errors.email ? 'invalid' : ''}
                />
                {errors.email && <p className="field-error">{errors.email}</p>}
            </div>

            <div className="field">
                <label htmlFor="signup-password">Password</label>
                <input
                    id="signup-password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                    className={errors.password ? 'invalid' : ''}
                />
                {errors.password && <p className="field-error">{errors.password}</p>}
            </div>

            <div className="field">
                <label htmlFor="signup-confirm">Confirm password</label>
                <input
                    id="signup-confirm"
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                    className={errors.confirmPassword ? 'invalid' : ''}
                />
                {errors.confirmPassword && <p className="field-error">{errors.confirmPassword}</p>}
            </div>

            <button type="submit" className="btn btn-gold auth-form__submit" disabled={!isValid || status.loading}>
                {status.loading ? 'Creating account...' : 'Sign up for PictureMe'}
            </button>

            {status.message && <p className="auth-form__status">{status.message}</p>}
        </form>
    );
}