import { ChangeEvent, useState } from "react";
import logo from "./assets/logo-nlw.svg";
import { NewNoteCard } from "./components/NewNoteCard";
import { NoteCard } from "./components/NoteCard";
import { toast } from "sonner";

interface INote {
  id: string;
  date: Date;
  content: string;
}

export function App() {
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState<INote[]>(() => {
    const notes = localStorage.getItem("notes");
    if (notes) {
      return JSON.parse(notes);
    }
    return [];
  });

  const onNoteCreated = (content: string) => {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    };

    const notesArray = [newNote, ...notes];
    setNotes([newNote, ...notes]);
    localStorage.setItem("notes", JSON.stringify(notesArray));
  };

  const handleSearchNote = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const onNoteDeleted = (id: string) => {
    const notesArray = notes.filter((note) => note.id !== id);
    setNotes(notesArray);
    localStorage.setItem("notes", JSON.stringify(notesArray));
    toast.success("Nota apagada com sucesso!");
  };

  const filteredNotes =
    search !== ""
      ? notes.filter((note) =>
          note.content
            .toLocaleLowerCase(undefined)
            .includes(search.toLocaleLowerCase())
        )
      : notes;

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5 md:px-0">
      <img src={logo} alt="" />
      <form action="" className="w-full">
        <input
          type="text"
          placeholder="Busque em suas notas"
          className="w-full bg-transparent text-3xl font-semibold tracking-tight placeholder:text-slate-500 outline-none"
          onChange={handleSearchNote}
        />
      </form>
      <div className="h-px bg-slate-700" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[250px] gap-6">
        <NewNoteCard onNoteCreated={onNoteCreated} />
        {filteredNotes.map((note) => (
          <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted} />
        ))}
      </div>
    </div>
  );
}
