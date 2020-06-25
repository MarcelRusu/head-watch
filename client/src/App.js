import React, {useState} from 'react';
import moment from 'moment';
import './App.css';
import {useFreshState} from './hooks';

const Rating = ({rating}) => (
  <></>
)

const Entry = ({saveNote, ...props}) => {
  const [note, setNote] = useFreshState(props.note, [props.note]);
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg">
      <div>
        <p>
        </p>
        <Rating rating={note.rating}/>
      </div>
      <textarea
        className="w-full resize-none"
        value={note.entry}
        onChange={e => setNote({...note, entry: e.target.value})}
      />
    </div>
  );
};

function App() {
  const [notes, setNotes] = useState([{date: moment(), entry: '', rating: undefined}]);

  return (
    <div className="App">
      {notes.map(note => <Entry note={note} />)}
    </div>
  );
}

export default App;
