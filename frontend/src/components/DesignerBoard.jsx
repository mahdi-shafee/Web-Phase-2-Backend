import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from "axios"
import '../styles/styles.css';

function DesignerBoard() {
    const navigate = useNavigate();
    const location = useLocation();
    const [designers, setDesigners] = useState([]);
    const [isNightMode, setIsNightMode] = useState(false);

    function compareNumbers(a, b) {
        return -a.queries + b.queries
    }

    const getDesigners = () => {
        const postData = {
            username:location.state.username,
        }

        axios.post('http://localhost:4000/get_designers', postData)
        .then (res =>  {
            const designers = res.data.designers
            designers.sort(compareNumbers)
            setDesigners(designers)
        }, [])
    }

    useEffect(() => {
        getDesigners();
    }, []);

    useEffect(() => {
        const updatedDesigners = designers.map((designer) => ({
            ...designer,
            following: JSON.parse(localStorage.getItem(designer.name)) ?? designer.following,
        }));
        setDesigners(updatedDesigners);
    }, []);

    const toggleFollow = (name) => {
        const postData = {
            username:location.state.username,
            followed_unfollowed:name
        }
        axios.post('http://localhost:4000/follow_unfollow', postData)
        const updatedDesigners = designers.map((designer) =>
            designer.name === name
                ? { ...designer, following: !designer.following }
                : designer
        );
        setDesigners(updatedDesigners);
        localStorage.setItem(name, JSON.stringify(!designers.find((d) => d.name === name).following));
    };

    const toggleNightMode = () => {
        setIsNightMode(!isNightMode);
        document.body.classList.toggle('night-mode', !isNightMode);
    };

    return (
        <div className={`container ${isNightMode ? 'night-mode' : ''}`}>
            <h1>Designers List</h1>
            <table className="scoreboard-table">
                <thead>
                    <tr>
                        <th>Designer</th>
                        <th>Number of Queries</th>
                        <th>Following Status</th>
                    </tr>
                </thead>
                <tbody>
                    {designers.map((designer) => (
                        <tr key={designer.name}>
                            <td>{designer.name}</td>
                            <td>{designer.queries}</td>
                            <td>
                                <button
                                    className={`follow-button ${designer.following ? 'unfollow' : 'follow'}`}
                                    onClick={() => toggleFollow(designer.name)}
                                >
                                    {designer.following ? 'Unfollow' : 'Follow'}
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

export default DesignerBoard;
