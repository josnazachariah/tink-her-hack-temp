import { useState, useEffect, useRef } from 'react';
import { getComplaints, addComplaint } from '../store';
import { analyzeIssueAI, suggestDescription } from '../utils/aiMock';
import { PlusCircle, Clock, CheckCircle, FileText, MapPin, Tag, Sparkles, Wand2, Search } from 'lucide-react';
import './Dashboard.css';

const LOCATIONS = [
    "Thiruvananthapuram, Kerala", "Kochi, Kerala", "Kozhikode, Kerala", "Thrissur, Kerala",
    "Kollam, Kerala", "Alappuzha, Kerala", "Palakkad, Kerala", "Malappuram, Kerala",
    "Kannur, Kerala", "Kottayam, Kerala", "Munnar, Kerala", "Wayanad, Kerala"
];

function UserDashboard({ user }) {
    const [complaints, setComplaints] = useState([]);
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Other', // default, AI will suggest
        location: '',
        image: null
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAIThinking, setIsAIThinking] = useState(false);
    const [aiNotice, setAiNotice] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const locationRef = useRef(null);

    useEffect(() => {
        loadComplaints();
    }, [user.email]);

    const loadComplaints = () => {
        setComplaints(getComplaints(user.email));
    };

    // Close suggestions when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (locationRef.current && !locationRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLocationChange = (e) => {
        const val = e.target.value;
        setFormData({ ...formData, location: val });
        if (val.length > 0) {
            const filtered = LOCATIONS.filter(loc => loc.toLowerCase().includes(val.toLowerCase()));
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(true); // show default options including 'current location'
        }
    };

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                // Add a formatted mock address for the demo
                const locationString = `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
                setFormData(prev => ({ ...prev, location: locationString }));
                setShowSuggestions(false);
                setIsLocating(false);
            },
            (error) => {
                console.error("Error getting location: ", error);
                alert("Unable to retrieve your location.");
                setIsLocating(false);
            }
        );
    };

    const handleSelectLocation = (loc) => {
        setFormData({ ...formData, location: loc });
        setShowSuggestions(false);
    };

    const handleAISuggest = async () => {
        if (!formData.title) {
            setAiNotice('Please enter a title first');
            setTimeout(() => setAiNotice(''), 3000);
            return;
        }
        setIsAIThinking(true);
        try {
            const suggestion = await suggestDescription(formData.title);
            setFormData(prev => ({ ...prev, description: suggestion }));
            setAiNotice('AI Suggested a description!');
            setTimeout(() => setAiNotice(''), 3000);
        } catch (err) {
            console.error(err);
        } finally {
            setIsAIThinking(false);
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFormData(prev => ({ ...prev, image: file }));
        setIsAIThinking(true);
        setAiNotice('AI analyzing image...');

        try {
            const aiResult = await analyzeIssueAI(file, formData.description, formData.location, formData.title);
            setFormData(prev => ({
                ...prev,
                category: aiResult.category
            }));
            setAiNotice(`AI categorized this as ${aiResult.category}!`);
            setTimeout(() => setAiNotice(''), 4000);
        } catch (err) {
            console.error(err);
        } finally {
            setIsAIThinking(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Simulate AI Analysis
            const aiData = await analyzeIssueAI(formData.image, formData.description, formData.location);

            const finalData = {
                ...formData,
                category: aiData.category,
                priority: aiData.priority
            };

            const newComplaint = addComplaint(finalData, user.email);
            setComplaints([newComplaint, ...complaints]);
            setShowSuggestions(false);
            setShowForm(false);
            setFormData({ title: '', description: '', category: 'Other', location: '', image: null });
        } catch (error) {
            console.error("Failed to submit:", error);
            alert("Submission failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Pending': return <span className="badge badge-pending">Pending Review</span>;
            case 'In Progress': return <span className="badge badge-progress">In Progress</span>;
            case 'Resolved': return <span className="badge badge-resolved">Resolved</span>;
            default: return null;
        }
    };

    return (
        <div className="dashboard-page page-container animate-fade-in">
            <div className="dashboard-header">
                <div>
                    <h2>My Reports</h2>
                    <p className="text-light">Track the status of the issues you've reported.</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(!showForm)}
                >
                    <PlusCircle size={18} /> {showForm ? 'Cancel Report' : 'New Report'}
                </button>
            </div>

            {showForm && (
                <div className="report-form-container card mb-8 animate-fade-in">
                    <h3>Submit a New Report</h3>
                    <form onSubmit={handleSubmit} className="report-form mt-4">
                        <div className="form-grid">
                            <div className="input-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="e.g. Deep pothole on Main St"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="input-group">
                                <label>Category</label>
                                <select
                                    className="select"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option>Roads & Infrastructure</option>
                                    <option>Waste Management</option>
                                    <option>Water & Sanitation</option>
                                    <option>Street Lighting</option>
                                    <option>Public Parks</option>
                                    <option>Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="input-group" ref={locationRef}>
                            <label>Location Area / Address</label>
                            <div className="input-with-icon">
                                <MapPin className="input-icon" size={18} />
                                <input
                                    type="text"
                                    className="input pl-10"
                                    placeholder="Start typing to search locations..."
                                    required
                                    value={formData.location}
                                    onChange={handleLocationChange}
                                    onFocus={() => {
                                        setShowSuggestions(true);
                                    }}
                                    autoComplete="off"
                                />
                            </div>
                            {showSuggestions && (
                                <ul className="suggestions-list">
                                    <li onClick={handleGetLocation} className="current-location-item">
                                        <MapPin size={14} className="text-primary mr-2" />
                                        {isLocating ? 'Locating...' : 'Use My Current Location'}
                                    </li>
                                    {formData.location.length === 0 ? LOCATIONS.slice(0, 3).map((loc, i) => (
                                        <li key={`default-${i}`} onClick={() => handleSelectLocation(loc)}>
                                            <MapPin size={14} className="text-light mr-2" /> {loc}
                                        </li>
                                    )) : suggestions.map((loc, i) => (
                                        <li key={`sugg-${i}`} onClick={() => handleSelectLocation(loc)}>
                                            <MapPin size={14} className="text-light mr-2" /> {loc}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="input-group">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label>Description</label>
                                <button
                                    type="button"
                                    className="btn-link text-primary"
                                    onClick={handleAISuggest}
                                    disabled={isAIThinking}
                                    style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                                >
                                    <Wand2 size={14} /> Suggest with AI
                                </button>
                            </div>
                            <textarea
                                className="textarea"
                                rows="4"
                                placeholder="Provide details about the issue..."
                                required
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            ></textarea>
                            {aiNotice && <div className="ai-feedback-msg">{aiNotice}</div>}
                        </div>

                        <div className="input-group">
                            <label>Attach Image (Optional)</label>
                            <input
                                type="file"
                                className="input file-input"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>

                        <div className="form-actions mt-4">
                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <><Sparkles size={18} className="animate-pulse" /> AI is analyzing...</>
                                ) : 'Submit Report'}
                            </button>
                            <button type="button" className="btn btn-secondary" disabled={isSubmitting} onClick={() => setShowForm(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="complaints-list">
                {complaints.length === 0 ? (
                    <div className="empty-state card text-center">
                        <FileText size={48} className="empty-icon" />
                        <h3>No reports yet</h3>
                        <p className="text-light">When you report an issue, it will appear here.</p>
                    </div>
                ) : (
                    <div className="complaints-grid">
                        {complaints.map(complaint => (
                            <div key={complaint.id} className="complaint-card card">
                                <div className="complaint-header">
                                    {getStatusBadge(complaint.status)}
                                    <span className="complaint-date">
                                        {new Date(complaint.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <h4 className="complaint-title">{complaint.title}</h4>
                                <div className="complaint-meta">
                                    <span className="meta-item"><Tag size={14} /> {complaint.category}</span>
                                    <span className="meta-item"><MapPin size={14} /> {complaint.location}</span>
                                </div>
                                <p className="complaint-desc">{complaint.description}</p>
                                <div className="complaint-footer">
                                    <span className="complaint-id">ID: #{complaint.id.slice(-6)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserDashboard;
