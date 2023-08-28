import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { StudySetService } from 'src/app/services/study-set.service';
import { MatchCardComponent } from 'src/app/components/match-card/match-card.component';

interface MatchCard {
  id: string;
  flashcardId: number;
  content: string;
}

@Component({
  selector: 'app-match',
  standalone: true,
  imports: [CommonModule, MatchCardComponent],
  template: `
    <div class="flex min-h-[calc(100vh-4rem)] bg-indigo-50 py-8">
      <div class="mx-auto max-w-7xl flex-1">
        <div>{{ ellapsedTime.toFixed(1) }}</div>
        <div
          *ngIf="matchCards && !finished"
          class="grid min-h-full w-full grid-cols-2 gap-3 md:grid-cols-4"
        >
          <app-match-card
            *ngFor="let card of matchCards"
            [content]="card.content"
            [selected]="card.id === first?.id || card.id === second?.id"
            [mismatch]="isMismatch(card)"
            [match]="isMatch(card)"
            (select)="selectCard(card)"
            (clearMismatch)="clearMismatch()"
          >
            {{ card.content }}
          </app-match-card>
        </div>
        <div *ngIf="finished">
          Congrats you have finished {{ ellapsedTime.toFixed(1) }}
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class MatchComponent {
  setId = +this.route.snapshot.params['setId'];
  studySetQuery: any;
  matchCards?: MatchCard[];
  first: MatchCard | null = null;
  second: MatchCard | null = null;
  matched: MatchCard[] = [];
  mismatch: MatchCard[] = [];
  finished: boolean = false;
  ellapsedTime: number = 0;
  interval: any;

  constructor(
    private route: ActivatedRoute,
    private studySetService: StudySetService,
  ) {}

  ngOnInit(): void {
    this.studySetService.getStudySet(this.setId).result$.subscribe((result) => {
      this.studySetQuery = result;

      const data = result.data;

      if (data) {
        this.matchCards = this.generateMatch(data);

        this.startTimer();
      }
    });
  }

  startTimer() {
    this.interval = setInterval(() => {
      this.ellapsedTime += 0.1;
    }, 100);
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

  isMatch(card: MatchCard) {
    return this.matched.some(({ id }) => id === card.id);
  }

  isMismatch(card: MatchCard) {
    return this.mismatch.some(({ id }) => id === card.id);
  }

  clearMismatch() {
    this.mismatch = [];
  }

  clearCards() {
    this.first = null;
    this.second = null;
  }

  selectCard(card: MatchCard) {
    if (!this.first) {
      this.first = card;
    } else {
      if (card.id === this.first.id) {
        this.first = null;
      } else {
        this.second = card;
      }
    }

    if (this.first && this.second) {
      if (this.first.flashcardId === this.second.flashcardId) {
        //match
        this.matched.push(this.first, this.second);
        this.clearCards();
      } else {
        this.mismatch = [this.first, this.second];
        this.clearCards();
      }
    }

    if (this.matched.length === this.matchCards?.length) {
      this.finished = true;
      this.pauseTimer();
    }
  }

  generateMatch(studySet: StudySet) {
    return studySet.flashcards
      .sort(() => 0.5 - Math.random())
      .slice(0, studySet.flashcards.length < 6 ? studySet.flashcards.length : 6)
      .flatMap((card) => [
        { flashcardId: card.id, content: card.term, id: crypto.randomUUID() },
        {
          flashcardId: card.id,
          content: card.definition,
          id: crypto.randomUUID(),
        },
      ])
      .sort(() => 0.5 - Math.random());
  }
}
