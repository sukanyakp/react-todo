import React, { useEffect, useRef, useState } from 'react';
import './css/ToDo.css';
import Todoitems from './todoitems';
import SnackBar from './SnackBar';

let count = 0;

const Todo = () => {
  const [todos, setTodos] = useState([]);
  console.log(todos,'just for checking');
  
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [dragIndex, setDragIndex] = useState(null);
  const inputRef = useRef(null);

  const add = () => {
    const taskText = inputRef.current.value.trim();
    if (taskText === '') {
      setSnackbarMessage('Please enter a task');
      setTimeout(() => {
        setSnackbarMessage('');
      }, 2000);
      return;
    }

    const isDuplicate = todos.some((todo) => todo.text.toLowerCase() === taskText.toLowerCase());
    if (isDuplicate) {
      setSnackbarMessage('Task already exists');
      setTimeout(() => {
        setSnackbarMessage('');
      }, 2000);
      return;
    }

    const updatedTodos = [...todos, { no: count++, text: taskText, display: '' }];
    setTodos(updatedTodos);
    inputRef.current.value = '';
    localStorage.setItem('todos-count', count);
  };

  const handleDragStart = (index) => {
    setDragIndex(index);
  };

  const handleDragOver = (event) => {
    event.preventDefault(); 
  };

  const handleDrop = (index) => {
    if (dragIndex === null) return;

    // Reorder 
    const updatedTodos = [...todos];
    const draggedItem = updatedTodos[dragIndex];
    updatedTodos.splice(dragIndex, 1); 
    updatedTodos.splice(index, 0, draggedItem);

    setTodos(updatedTodos);
    setDragIndex(null); 
  };

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem('todos')) || [];
    const storedCount = parseInt(localStorage.getItem('todos-count'), 10) || 0;
    setTodos(storedTodos);
    count = storedCount;
  }, []); // page reload

  useEffect(() => {
    setTimeout(() => {
      localStorage.setItem('todos', JSON.stringify(todos));
    }, 100);
  }, [todos]);

  return (
    <div className="todo">
      <div className="todo-header">ToDo-List</div>
      <div className="todo-add">
        <input
          ref={inputRef}
          type="text"
          placeholder="Add Your Task"
          className="todo-input"
        />
        <div onClick={add} className="todo-add-btn">
          Add
        </div>
      </div>

      <div className="todo-list">
        {todos.map((item, index) => (
          <div
          key={item.no} // Use a unique identifier instead of index
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(index)}
          >
            <Todoitems
              setTodos={setTodos}
              no={item.no}
              display={item.display}
              text={item.text}
            />
          </div>
        ))}
      </div>

      {snackbarMessage && (
        <SnackBar message={snackbarMessage} open={true} />
      )}
    </div>
  );
};

export default Todo;
