import React, { useContext, useState } from 'react';
import NoteContext from '../Context/notes/NoteContext';

const Addnote = () => {
  const { addnote } = useContext(NoteContext);
  const [note, setNote] = useState({ title: "", description: "", tag: "" });

  const handleclick = (e) => {
    e.preventDefault();
    // Prevent adding note if title or description is empty
    if (!note.title || !note.description) {
      alert("Title and Description cannot be empty");
      return;
    }
    addnote(note.title, note.description, note.tag);
    setNote({ title: "", description: "", tag: "" });
  }

  const onchange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  }

  return (
    <div className="container my-3">
      <h1>Add notes</h1>
      <form onSubmit={handleclick}>
        <div className="mb-3 my-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={note.title}
            onChange={onchange}
            minLength={5} required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <input
            type="text"
            className="form-control"
            id="description"
            name="description"
            value={note.description}
            onChange={onchange}
            minLength={5} required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="tag" className="form-label">Tag</label>
          <input
            type="text"
            className="form-control"
            id="tag"
            name="tag"
            value={note.tag}
            onChange={onchange}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={note.title.length<5 || note.description.length<5} // disable button if length is less then 5
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Addnote;
