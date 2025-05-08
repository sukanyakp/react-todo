import React, { useState, useRef } from 'react';
import './css/todoitems.css';
import tick from './assets/tick.webp';
import cross from './assets/cross.png';
import round from './assets/round.avif';
import edit from './assets/edit_icon.svg';
import SnackBar from './SnackBar';

const Todoitems = ({ no, display, text, setTodos }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const inputRef = useRef(null);

  const deleteTodo = () => {
    const data = JSON.parse(localStorage.getItem('todos')) || [];
    const updatedTodos = data.filter((todo) => todo.no !== no);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
    setTodos(updatedTodos);
  };

  const toggle = (no) => {
    if (isEditing) return;

    const data = JSON.parse(localStorage.getItem('todos')) || [];
    const updatedTodos = data.map((todo) =>
      todo.no === no
        ? { ...todo, display: todo.display === '' ? 'line-through' : '' }
        : todo
    );
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
    setTodos(updatedTodos);
  };

  const startEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.value = text;
      }
    }, 0);
  };

  const saveEditing = () => {
    if (!inputRef.current || inputRef.current.value.trim() === '') {
      showSnackbar('Task cannot be empty');
      return;
    }

    const newValue = inputRef.current.value.trim();
    const data = JSON.parse(localStorage.getItem('todos')) || [];

    const isDuplicate = data.some(
      (todo) => todo.text.toLowerCase() === newValue.toLowerCase() && todo.no !== no
    );
    if (isDuplicate) {
      showSnackbar('Task already exists');
      return;
    }

    const updatedTodos = data.map((todo) =>
      todo.no === no ? { ...todo, text: newValue } : todo
    );
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
    setTodos(updatedTodos);
    setIsEditing(false);
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
    setTimeout(() => {
      setSnackbarOpen(false);
    }, 2000);
  };

  return (
    <div className="todoitems">
      <div
        className={`todoitems-container ${display}`}
        onClick={() => toggle(no)}
      >
        {display === '' ? (
          <img src={round} alt="Incomplete" />
        ) : (
          <img src={tick} alt="Complete" />
        )}

        {isEditing ? (
          <>
            <input
              type="text"
              ref={inputRef}
              className="todo-edit-input"
              defaultValue={text}
            />
            <button onClick={saveEditing} className="save-button">
              Save
            </button>
          </>
        ) : (
          <div className="todoitems-text">{text}</div>
        )}
      </div>
      {!isEditing && (
        <img
          onClick={startEditing}
          src={edit}
          alt="Edit"
          className="edit-icon"
        />
      )}
      {isConfirmingDelete ? (
        <div className="confirmation-inline">
          <span>Are you sure?</span>
          <button onClick={deleteTodo} className="confirm-btn">
            Yes
          </button>
          <button
            onClick={() => setIsConfirmingDelete(false)}
            className="cancel-btn"
          >
            No
          </button>
        </div>
      ) : (
        <img
          onClick={() => setIsConfirmingDelete(true)}
          src={cross}
          alt="Delete"
          className="delete-icon"
        />
      )}

      <SnackBar message={snackbarMessage} open={snackbarOpen} />
    </div>
  );
};

export default Todoitems;
