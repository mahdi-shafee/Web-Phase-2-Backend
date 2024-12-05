import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from "axios"
import '../styles/styles.css';

function Scoreboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const username = location.state.username
    const [scoreBoard, setScoreBoard] = useState([]);
    const [isNightMode, setIsNightMode] = useState(false);

    function compareNumbers(a, b) {
        return -a.score + b.score
    }

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

    const toggleFollowStatus = (index) => {
        const postData = {
            username:location.state.username,
            followed_unfollowed:scoreBoard[index].player
        }
        axios.post('http://localhost:4000/follow_unfollow', postData)
        setScoreBoard((prevPlayers) =>
            prevPlayers.map((player, i) =>
                i === index ? { ...player, following: !player.following } : player
            )
        );
    };

    return (
        <div className={`container ${isNightMode ? 'night-mode' : ''}`}>
            <h1>Scoreboard</h1>
            <table className="scoreboard-table">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Player</th>
                        <th>Score</th>
                        <th>Following Status</th>
                    </tr>
                </thead>
                <tbody>
                    {scoreBoard.map((player, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{player.player}</td>
                            <td>{player.score}</td>
                            <td>
                                <button
                                    className="follow-button"
                                    style={{
                                        backgroundColor: player.following ? '#F4978E' : '#C6CEB3',
                                        color: '#fff',
                                        border: 'none',
                                        padding: '5px 10px',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => toggleFollowStatus(index)}
                                >
                                    {player.following ? 'Unfollow' : 'Follow'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
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

export default Scoreboard;
