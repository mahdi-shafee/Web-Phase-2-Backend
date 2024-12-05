import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from "axios"
import '../styles/styles.css';

function PlayerDashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const username = location.state.username
    const [isNightMode, setIsNightMode] = useState(false);
    const [scoreBoard, setScoreBoard] = useState([]);
    const [designers, setDesigners] = useState([]);
    const [recentQueries, setRecentQueries] = useState([]);

    const getQueries = () => {

        axios.post('http://localhost:4000/get_all_queries')
        .then (res =>  {
            let q = []
            for (let i = 0; i < res.data.queries.length; i++) {
                q.push(res.data.queries[i].question)
            }
            setRecentQueries(q)
        }, [])
    }

    useEffect(() => {
        getQueries();
    }, []);

    function compareNumbers(a, b) {
        return -a.score + b.score
    }

    const getDesigners = () => {
        const postData = {
            username:location.state.username,
        }

        axios.post('http://localhost:4000/get_designers', postData)
        .then (res =>  {
            const designers = res.data.designers
            let recentDesigners = []

            for (let i = 0; i<designers.length; i++) {
                recentDesigners.push(designers[i].name)
            }
            setDesigners(recentDesigners)
        }, [])
    }

    useEffect(() => {
        getDesigners();
    }, []);

    const getScores = () => {

        const postData = {
            username:location.state.username,
        }

        axios.post('http://localhost:4000/get_scores', postData)
        .then (res =>  {
            const scores = res.data.score_board
            scores.sort(compareNumbers)
            setScoreBoard(scores)
        }, [])
    }

    useEffect(() => {
        getScores();
    }, []);

    const toggleNightMode = () => {
        setIsNightMode(!isNightMode);
        document.body.classList.toggle('night-mode', !isNightMode);
    };

    const renderCard = (title, items, buttonLabel, navigateTo) => (
        <div className="card">
            <h2>{title}</h2>
            <ul>
                {items.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
            <button onClick={() => navigate(navigateTo, {state:{username:location.state.username}})}>{buttonLabel}</button>
        </div>
    );

    return (
        <div className={`container ${isNightMode ? 'night-mode' : ''}`}>
            <h1>Player Dashboard</h1>
            <div className="card-container">
                {renderCard(
                    'Scoreboard',
                    scoreBoard.map((score) => `${score.player} - ${score.score} Points`),
                    'Go to Scoreboard',
                    '/scoreboard'
                )}
                {renderCard('Answer Queries', recentQueries, 'Go to Answer Queries', '/answer-queries')}
                {renderCard('Show Designers', designers, 'Go to Designers Board', '/designerboard')}
            </div>
            <button className="back-button" onClick={() => navigate('/')}>Logout</button>
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

export default PlayerDashboard;
