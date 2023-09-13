interface User {
  id: number;
  name: string;
  email: string;
  imageUrl: string | null;
}

interface Flashcard {
  id: number;
  term: string;
  definition: string;
  place: number;
}

interface StudySet {
  id: number;
  title: string;
  description: string;
  flashcards: Flashcard[];
  user: User;
}

interface Folder {
  id: number;
  name: string;
  description: string;
  studySets: StudySet[];
  user: User;
}
