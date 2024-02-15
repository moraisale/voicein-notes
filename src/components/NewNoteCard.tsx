import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";

interface INewNoteCard {
  onNoteCreated: (content: string) => void;
}

let speechRecognition: SpeechRecognition | null = null;

export const NewNoteCard = ({ onNoteCreated }: INewNoteCard) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [noteContent, setNoteContent] = useState<string>("");
  const [shouldShowOnboarding, setShouldShowOnboarding] =
    useState<boolean>(true);

  const handleStartEditor = () => {
    setShouldShowOnboarding(false);
  };

  const handleContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setNoteContent(event.target.value);
    event.target.value === "" && setShouldShowOnboarding(true);
  };

  const handleSaveNote = (event: FormEvent) => {
    event.preventDefault();

    if (noteContent === "") {
      return;
    }

    onNoteCreated(noteContent);
    setNoteContent("");
    setShouldShowOnboarding(true);
    toast.success("Nota criada com sucesso!");
  };

  const handleStartRecording = () => {
    const isSpeechRecognitionAPIAvailable =
      "SpeechRecognition" in window || "webkitSpeechRecognition" in window;

    if (!isSpeechRecognitionAPIAvailable) {
      toast.error(
        "Seu navegador não suporta a funcionalidade de gravação de áudio."
      );
      return;
    }

    setIsRecording(true);
    setShouldShowOnboarding(false);

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    speechRecognition = new SpeechRecognitionAPI();

    speechRecognition.continuous = true;
    speechRecognition.interimResults = true;
    speechRecognition.lang = "pt-BR";
    speechRecognition.maxAlternatives = 1;

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript);
      }, "");

      setNoteContent(transcription);
    };

    speechRecognition.onerror = (event) => {
      console.log(event);
    };

    speechRecognition.start();
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    speechRecognition && speechRecognition.stop();
  };

  return (
    <Dialog.Root>
      <Dialog.DialogTrigger className="rounded-md flex flex-col bg-slate-700 text-left p-5 gap-3 hover:ring-2 hover:ring-slate-600 outline-none focus-visible:ring-2 focus-visible:ring-lime-400">
        <span className="text-sm font-medium text-slate-200">
          Adicionar nota
        </span>
        <p className="text-sm leading-6 text-slate-400">
          Grave uma nota em áudio que será convertida para texto
          automaticamente.
        </p>
      </Dialog.DialogTrigger>

      <Dialog.DialogPortal>
        <Dialog.DialogOverlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] h-[60vh] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none">
          <Dialog.DialogClose className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
            <X className="size-5" />
          </Dialog.DialogClose>

          <form onSubmit={handleSaveNote} className="flex-1 flex flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-300">
                Adicionar nota
              </span>
              {shouldShowOnboarding ? (
                <p className="text-sm leading-6 text-slate-400">
                  {" "}
                  Comece{" "}
                  <button
                    className="font-medium text-lime-400 hover:underline"
                    onClick={handleStartRecording}
                    type="button"
                  >
                    gravando uma nota
                  </button>{" "}
                  em áudio ou se preferir{" "}
                  <button
                    onClick={() => handleStartEditor()}
                    type="button"
                    className="font-medium text-lime-400 hover:underline "
                  >
                    utilize apenas texto.
                  </button>
                </p>
              ) : (
                <textarea
                  value={noteContent}
                  autoFocus
                  className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                  onChange={handleContentChange}
                />
              )}
            </div>

            {isRecording ? (
              <button
                onClick={handleStopRecording}
                type="button"
                className="w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium group hover:text-slate-100"
              >
                <div className="size-3 rounded-full bg-red-500 animate-pulse" />
                Gravando! (clique p/ interromper)
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveNote}
                className="w-full bg-lime-400 py-4 text-center text-sm text-lime-900 outline-none font-medium group hover:bg-lime-500"
              >
                Salvar nota
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.DialogPortal>
    </Dialog.Root>
  );
};
