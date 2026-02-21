import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { registerUser, verifyLogin } from '../store';
import { Shield, User, ArrowRight } from 'lucide-react';
import './Auth.css';

function Auth({ onLogin }) {
    const [searchParams] = useSearchParams();
    const initialMode = searchParams.get('mode') || 'login';

    const [isLogin, setIsLogin] = useState(initialMode !== 'register');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        try {
            if (isLogin) {
                const user = verifyLogin(formData.email, formData.password);
                onLogin(user);
            } else {
                const user = registerUser(formData.email, formData.password, formData.name);
                onLogin(user);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container animate-fade-in">
                <div className="auth-left">
                    <div className="auth-brand">
                        <span className="logo-icon">🏛️</span>
                        <h2>Fix My City Portal</h2>
                    </div>
                    <p>
                        Join our community to report issues or access the portal to manage your city's reports.
                    </p>
                    <div className="auth-illustration">
                        <div className="illustration-circle"></div>
                    </div>
                </div>

                <div className="auth-right">


                    <div className="auth-card card">
                        <h3 className="auth-title">
                            {isLogin ? 'Sign In' : 'Create an Account'}
                        </h3>

                        {error && <div className="auth-error">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            {!isLogin && (
                                <div className="input-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        className="input"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            )}

                            <div className="input-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    className="input"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="input-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    className="input"
                                    required
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>

                            <button type="submit" className="btn btn-primary w-full mt-4">
                                {isLogin ? 'Sign In' : 'Register'} <ArrowRight size={18} />
                            </button>
                        </form>

                        <div className="auth-switch">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                type="button"
                                className="btn-link"
                                onClick={() => setIsLogin(!isLogin)}
                            >
                                {isLogin ? 'Register here' : 'Sign in here'}
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Auth;
