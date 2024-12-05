import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from "axios"
import '../styles/styles.css';


const handleSubmit = (username, query, answer) => {
    if (answer === '') {
        alert('Please choose an answer.');
    } else {
        const postData = {
            username:username,
            query:query,
            answer:answer
        }
        axios.post('http://localhost:4000/submit_answer', postData)
        .then (res =>  {
            alert(res.data.response)
        }, [])
    }

};

function AnswerQueries() {
    const navigate = useNavigate();
    const location = useLocation();
    const username = location.state.username
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [randomQuery, setRandomQuery] = useState(null);
    const [isNightMode, setIsNightMode] = useState(false);
    const [allCategories, setAllCategories] = useState([]);
    const [allQueries, setAllQueries] = useState([]);

    const getAllQueries = () => {

        axios.post('http://localhost:4000/get_all_queries')
        .then (res =>  {
            setAllQueries(res.data.queries)
        }, [])
    }

    useEffect(() => {
        getAllQueries();
    }, []);

    const getAllCategories = () => {

        axios.post('http://localhost:4000/get_all_categories')
        .then (res =>  {
            setAllCategories(res.data.categories)
        }, [])
    }

    useEffect(() => {
        getAllCategories();
    }, []);

    const answeredQueries = [
        {
            id: 12,
            question: 'What is the capital of France?',
            yourAnswer: 'Berlin',
            correctAnswer: 'Paris',
            score: '0/45',
        },
        {
            id: 21,
            question: 'What is the largest planet in our solar system?',
            yourAnswer: 'Jupiter',
            correctAnswer: 'Jupiter',
            score: '30/30',
        },
    ];

    const filteredQueries =
        selectedCategory == 'All'
            ? allQueries
            : allQueries.filter((query) => query.category === selectedCategory);

    const handleShowRandomQuery = () => {
        const random = filteredQueries[Math.floor(Math.random() * filteredQueries.length)];
        setRandomQuery(random);
    };

    const toggleNightMode = () => {
        setIsNightMode(!isNightMode);
        document.body.classList.toggle('night-mode', !isNightMode);
    };

    return (
        <div className={`container ${isNightMode ? 'night-mode' : ''}`}>
            <h1>Available Queries</h1>
            <div className="form-group">
                <label htmlFor="category-select">Filter by Category:</label>
                <select
                    id="category-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    {allCategories.map((category, index) =>(
                        <option>
                            {category}
                        </option>
                    ))}
                </select>
            </div>
            <div className="button-group">
                <button className="random-query-btn" onClick={handleShowRandomQuery}>
                    Answer Random Query
                </button>
                <button className="show-all-btn" onClick={() => setRandomQuery(null)}>
                    Show All Queries
                </button>
            </div>

            <div className="query-card-container">
                {randomQuery ? (
                    <QueryCard key={randomQuery.id} query={[randomQuery, location.state.username]} />
                ) : (
                    filteredQueries.map((query) => <QueryCard key={query.id} query={[query, location.state.username]} />)
                )}
            </div>

            <button className="back-button" onClick={() => navigate('/player', {state:{username:location.state.username}})}>
                Back to Player Dashboard
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

function QueryCard({ query }) {
    let username = query[1]
    query = query[0]
    let answer = ''
    return (
        <div className="query-card">
            <h3>{query.question}</h3>
            <select defaultValue=""
            onChange={(e) => answer = e.target.value}
            >
                <option value="" disabled>
                    Select an answer
                </option>
                {query.options.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            <button onClick={() => handleSubmit(username, query, answer)}>Submit Answer</button>
        </div>
    );
}

function AnsweredQueryCard({ query }) {
    return (
        <div className="answered-query-card">
            <h3>{query.question}</h3>
            <p>
                <strong>Your Answer:</strong> {query.yourAnswer}
            </p>
            <p>
                <strong>Correct Answer:</strong> {query.correctAnswer}
            </p>
            <p>
                <strong>Score:</strong> {query.score}
            </p>
        </div>
    );
}

export default AnswerQueries;
