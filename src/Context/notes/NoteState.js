import { useState } from "react";
import NoteContext from "./NoteContext";

const NoteState = (props) => {
  const host = "http://localhost:5000";

  const [notes, setNotes] = useState([]);

  // Fetch all notes
  const getnote = async () => {
    try {
      const response = await fetch(`${host}/api/note/fetchallnotes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
         "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjk2YjY3MjVhYzU3Mjk0ODAxMzE1NWEzIn0sImlhdCI6MTc2ODY0NjQzN30.VVpTfUrC_ufMbcl1tnyMIuafVRgoDHHZ-bGLWEcMNeA",
      },
      });
      const json = await response.json();
      setNotes(json);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  // Add a note
  const addnote = async (title, description, tag) => {
    try {
      const response = await fetch(`${host}/api/note/addnote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
         "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjk2YjY3MjVhYzU3Mjk0ODAxMzE1NWEzIn0sImlhdCI6MTc2ODY0NjQzN30.VVpTfUrC_ufMbcl1tnyMIuafVRgoDHHZ-bGLWEcMNeA",
      },
        body: JSON.stringify({ title, description, tag }),
      });

      const json = await response.json();
      setNotes((prevNotes) => prevNotes.concat(json)); // safer state update
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  // Delete a note
  const deletenote = async (id) => {
    try {
      const response = await fetch(`${host}/api/note/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjk2YjY3MjVhYzU3Mjk0ODAxMzE1NWEzIn0sImlhdCI6MTc2ODY0NjQzN30.VVpTfUrC_ufMbcl1tnyMIuafVRgoDHHZ-bGLWEcMNeA",
      },
      });

      // Only log response if backend returns JSON
      const json = await response.json().catch(() => null);
      console.log("Deleted note:", json);

      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  // Edit a note
  const editnote = async (id, title, description, tag) => {
    try {
      const response = await fetch(`${host}/api/note/update/${id}`, {
        method: "PUT", // use PUT for update
        headers: {
          "Content-Type": "application/json",
         "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjk2YjY3MjVhYzU3Mjk0ODAxMzE1NWEzIn0sImlhdCI6MTc2ODY0NjQzN30.VVpTfUrC_ufMbcl1tnyMIuafVRgoDHHZ-bGLWEcMNeA",
      },
        body: JSON.stringify({ title, description, tag }),
      });

      const json = await response.json(); // backend updated note
      console.log(json);

      // Update state
      let newnote=JSON.parse(JSON.stringify(notes))

      for(let index=0;index<newnote.length;index++)
      {
        const element=newnote[index];
        if(element._id===id){
            newnote[index].title=title;
            newnote[index].description=description;
            newnote[index].tag=tag;
            break;
        }
      }
      setNotes(newnote);
 
    } catch (error) {
      console.error("Error editing note:", error);
    }
  };

  return (
    <NoteContext.Provider
      value={{ notes, addnote, deletenote, editnote, getnote }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
