interface User {
  id: number;
  name: string;
  email: string;
  imageUrl: string;
}

interface Flashcard {
  id: number;
  term: string;
  definition: string;
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
