import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const emptyErrors = { email: '', password: '' };

export default function LoginForm() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState(emptyErrors);
    const [status, setStatus] = useState({ loading: false, message: '' });

    function validate(values) {
        const nextErrors = { ...emptyErrors };
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

        setErrors(nextErrors);
        return !nextErrors.email && !nextErrors.password;
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
            const response = await fetch(`${API_BASE}/api/auth/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await response.json();

            if (!response.ok || !data.success) {
                setStatus({ loading: false, message: data.message || 'Sign in failed.' });
                return;
            }

            setStatus({ loading: false, message: 'Signed in successfully.' });
            navigate('/home');
        } catch (error) {
            setStatus({
                loading: false,
                message: 'Could not reach the server. Is the backend running?',
            });
        }
    }

    const isValid = form.email.trim() && form.password.length >= 6;

    return (
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="field">
                <label htmlFor="login-email">Email address</label>
                <input
                    id="login-email"
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
                <label htmlFor="login-password">Password</label>
                <input
                    id="login-password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                    className={errors.password ? 'invalid' : ''}
                />
                {errors.password && <p className="field-error">{errors.password}</p>}
                <a href="#forgot" className="auth-form__forgot">
                    Forgot password?
                </a>
            </div>

            <button type="submit" className="btn btn-gold auth-form__submit" disabled={!isValid || status.loading}>
                {status.loading ? 'Signing in...' : 'Log in to PictureMe'}
            </button>

            {status.message && <p className="auth-form__status">{status.message}</p>}
        </form>
    );
}