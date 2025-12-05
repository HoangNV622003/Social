// src/components/group/SelectedMembers.jsx
import React from 'react';
import { FiX } from 'react-icons/fi';
import './SelectedMembers.css';
import UserAvatar from '../../UserAvatar/UserAvatar';

const SelectedMembers = ({ members, onRemove }) => {
    return (
        <div className="sm-container">
            {members.map(m => (
                <div key={m.id} className="sm-chip">
                    <UserAvatar username={m.username} image={m.image} size='small' />
                    <span className="sm-name">{m.username}</span>
                    <button onClick={() => onRemove(m.id)} className="sm-remove">
                        <FiX size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default SelectedMembers;