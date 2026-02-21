import { Link } from 'react-router-dom';
import { Shield, User } from 'lucide-react';
import './Navbar.css';

function Navbar({ user, onLogout }) {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <span className="logo-icon">🏛️</span>
                    <span className="logo-text">Fix My City</span>
                </Link>

                <div className="navbar-links">
                    {user ? (
                        <div className="user-menu">
                            <span className="user-greeting">
                                Hello, {user.role === 'admin' ? 'Admin' : 'User'}
                            </span>
                            <button onClick={onLogout} className="btn btn-secondary btn-sm">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login?mode=register" className="btn btn-primary">
                                <User size={18} />
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
