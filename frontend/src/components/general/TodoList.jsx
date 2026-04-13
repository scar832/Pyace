import React from 'react';
import { MoreVertical, CheckCircle, Circle } from 'lucide-react';
import './TodoList.css';

const TodoList = ({ items }) => {
    return (
        <div className="widget todo-widget">
            <div className="widget-header">
                <h3>To-Do List</h3>
                <button className="icon-btn"><MoreVertical size={16} /></button>
            </div>
            <div className="todo-list-modern">
                {items.map((item, idx) => (
                    <div key={idx} className={`todo-item-modern ${item.completed ? 'completed' : ''}`}>
                        <button className="todo-check-btn">
                            {item.completed ? (
                                <CheckCircle size={20} className="check-icon completed" />
                            ) : (
                                <Circle size={20} className="check-icon" />
                            )}
                        </button>
                        <div className="todo-info-modern">
                            <h4 className="todo-title">{item.task}</h4>
                            <span className={`todo-label-badge ${item.type.toLowerCase()}`}>{item.type}</span>
                        </div>
                        {item.important && <div className="important-indicator"></div>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TodoList;
