import { createHashRouter } from 'react-router';
import { GameSetup } from './components/GameSetup';
import { RoundsList} from './components/RoundsList';
import { AddRound } from './components/AddRound';
import { Settlement } from './components/Settlement';
import { Scores } from './components/Scores';

export const router = createHashRouter([
  {
    path: '/',
    Component: GameSetup,
  },
  {
    path: '/rounds',
    Component: RoundsList
  },
  {
    path: '/add-round',
    Component: AddRound
  },
  {
    path: '/settlement',
    Component: Settlement
  },
  {
    path: '/scores',
    Component: Scores
  },
  
]);
