import { Bookmark, BookmarkCheck } from "lucide-react";

// Types of parameters to be passed to bookmark 
// Parameters include saved, onSaved, onRemoved
type Props = {
    saved: boolean
    onSave: () => void;
    onRemove: () => void;
};

export function SaveButton({saved, onSave, onRemove}: Props){
    return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        saved ? onRemove() : onSave();
      }}
      className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer shrink-0"
      style={{
        background: saved ? "rgba(196,113,74,0.12)" : "#f0ede8",
        color: saved ? "#c4714a" : "#b8b3ad",
      }}
      title={saved ? "Remove" : "Save"}
    >
      {saved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
    </button>
  )
};
