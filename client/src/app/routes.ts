import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LatestComponent } from './pages/latest/latest.component';
import { AccessGuardService } from './services/access-guard.service';
import { HomeGuardService } from './services/home-guard.service';
import { CreateSetComponent } from './pages/create-set/create-set.component';
import { StudysetComponent } from './pages/studyset/studyset.component';
import { EditSetComponent } from './pages/edit-set/edit-set.component';
import { FlashcardsComponent } from './pages/flashcards/flashcards.component';
import { LearnComponent } from './pages/learn/learn.component';
import { TestComponent } from './pages/test/test.component';
import { MatchComponent } from './pages/match/match.component';
import { UserComponent } from './pages/user/user.component';
import { StudySetsComponent } from './pages/study-sets/study-sets.component';
import { FoldersComponent } from './pages/folders/folders.component';
import { FolderComponent } from './pages/folder/folder.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { SettingsComponent } from './pages/settings/settings.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [HomeGuardService],
  },
  {
    path: 'latest',
    component: LatestComponent,
    canActivate: [AccessGuardService],
  },
  {
    path: 'create-set',
    component: CreateSetComponent,
    canActivate: [AccessGuardService],
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AccessGuardService],
  },
  {
    path: ':userId',
    component: UserComponent,
  },
  {
    path: ':userId/study-sets',
    component: StudySetsComponent,
  },
  {
    path: ':userId/folders',
    component: FoldersComponent,
  },
  {
    path: ':userId/folders/:folderId',
    component: FolderComponent,
  },
  {
    path: 'study-set/:setId',
    component: StudysetComponent,
  },
  {
    path: 'study-set/:setId/flashcards',
    component: FlashcardsComponent,
  },
  {
    path: 'study-set/:setId/learn',
    component: LearnComponent,
  },
  {
    path: 'study-set/:setId/test',
    component: TestComponent,
  },
  {
    path: 'study-set/:setId/match',
    component: MatchComponent,
  },
  {
    path: 'study-set/:setId/edit',
    component: EditSetComponent,
    canActivate: [AccessGuardService],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
