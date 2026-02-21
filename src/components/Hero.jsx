import { Link } from 'react-router-dom';
import { ArrowRight, FileText, CheckCircle, Clock } from 'lucide-react';
import './Hero.css';

function Hero({ user }) {
    return (
        <div className="hero">
            <div className="hero-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            <div className="hero-content page-container animate-fade-in">
                <div className="hero-text">
                    <div className="hero-badge">Modern Civic Tech</div>
                    <h1 className="hero-title">
                        Fixing Cities, <br />
                        <span className="text-highlight">One Report at a Time</span>
                    </h1>
                    <p className="hero-subtitle">
                        A smart, integrated platform for citizens to report local issues and government
                        officials to track, manage, and resolve them efficiently.
                    </p>

                    <div className="hero-actions">
                        <Link to={user ? "/dashboard" : "/login?mode=register"} className="btn btn-primary btn-lg">
                            Report an Issue <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="mock-ui">
                        <div className="mock-header">Recent Reports</div>
                        <div className="mock-card">
                            <div className="mock-icon bg-yellow"><Clock size={16} color="#b45309" /></div>
                            <div className="mock-info">
                                <div className="mock-title">Pothole on Main St</div>
                                <div className="mock-meta">Pending Review</div>
                            </div>
                        </div>
                        <div className="mock-card">
                            <div className="mock-icon bg-green"><CheckCircle size={16} color="#166534" /></div>
                            <div className="mock-info">
                                <div className="mock-title">Broken Streetlight</div>
                                <div className="mock-meta">Resolved Yesterday</div>
                            </div>
                        </div>
                        <div className="mock-card">
                            <div className="mock-icon bg-blue"><FileText size={16} color="#1e40af" /></div>
                            <div className="mock-info">
                                <div className="mock-title">Water Pipe Leak</div>
                                <div className="mock-meta">In Progress</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Hero;
