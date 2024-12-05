import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from "axios"
import '../styles/styles.css';

function DesignerDashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isNightMode, setIsNightMode] = useState(false);
    const [recentCategories, setCategories] = useState([]);
    const [queries, setQueries] = useState([]);

    

    const axiosGetCategories = () => {
        const postData = {
            username:location.state.username,
        }

        axios.post('http://localhost:4000/get_categories', postData)
        .then (res =>  {
            setCategories(res.data.categories.categories)
        }, [])
    }

    const axiosGetQueries = () => {
        const postData = {
            username:location.state.username,
        }

        axios.post('http://localhost:4000/get_queries', postData)
        .then (res =>  {
            let queries = []
            for (let i = 0; i < res.data.categories.queries.length; i++) {
                queries.push(res.data.categories.queries[i].question)
            }
            setQueries(queries)
        }, [])
    }

    useEffect(() => {
        axiosGetCategories();
    }, []);

    useEffect(() => {
        axiosGetQueries();
    }, []);

    const toggleNightMode = () => {
        setIsNightMode(!isNightMode);
        document.body.classList.toggle('night-mode', !isNightMode);
    };

    return (
        <div className={`container ${isNightMode ? 'night-mode' : ''}`}>
            <h1>Designer Dashboard</h1>
            <div className="card-container">
                <div className="card">
                    <h2>Category Management</h2>
                    <ul>
                        {recentCategories.map((category, index) => (
                            <li key={index}>{category}</li>
                        ))}
                    </ul>
                    <button onClick={() => navigate('/category-management', {state:{username:location.state.username}})}>
                        Go to Category Management
                    </button>
                </div>
                <div className="card">
                    <h2>Query Management</h2>
                    <ul>
                        {queries.map((query, index) => (
                            <li key={index}>{query}</li>
                        ))}
                    </ul>
                    <button onClick={() => navigate('/query-management', {state:{username:location.state.username}})}>
                        Go to Query Management
                    </button>
                </div>
            </div>
            <button className="back-button" onClick={() => navigate('/')}>
                Logout
            </button>
            <div className="toggle-container">
                <input
                    type="checkbox"
                    id="night-mode-toggle"
                    className="toggle-checkbox"
                    checked={isNightMode}
                    onChange={toggleNightMode}
                />
                <label htmlFor="night-mode-toggle" className="toggle-label"></label>
            </div>
        </div>
    );
}

export default DesignerDashboard;
