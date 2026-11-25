// Associe les méthodes et chemins HTTP aux contrôleurs (préfixe /api/games ajouté dans app.ts).

import {Router} from 'express';
import {createGame, deleteGame, getGame, listGames, updateGame} from '../controllers/game.controller.js';

export const gameRoutes = Router();

gameRoutes.get('/', listGames);
gameRoutes.post('/', createGame);
gameRoutes.get('/:id', getGame);
gameRoutes.put('/:id', updateGame);
gameRoutes.delete('/:id', deleteGame);
