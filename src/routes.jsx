import { createHashRouter } from 'react-router';
import { GameSetup } from './components/GameSetup';
import { RoundsList} from './components/RoundsList';
import { AddRound } from './components/AddRound';
import { Settlement } from './components/Settlement';
import { Scores } from './components/Scores';
import { RouteError } from './components/RouteError';

export const router = createHashRouter([
  {
    path: '/',
    Component: GameSetup,
    errorElement: <RouteError />,
  },
  {
    path: '/rounds',
    Component: RoundsList,
    errorElement: <RouteError />,
  },
  {
    path: '/add-round',
    Component: AddRound,
    errorElement: <RouteError />,
  },
  {
    path: '/add-round/:roundId',
    Component: AddRound,
    errorElement: <RouteError />,
  },
  {
    path: '/settlement',
    Component: Settlement,
    errorElement: <RouteError />,
  },
  {
    path: '/scores',
    Component: Scores,
    errorElement: <RouteError />,
  },
  
]);
