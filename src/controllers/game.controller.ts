// Contrôleurs : lisent la requête, appellent le service et envoient la réponse.
// Express 5 transmet automatiquement les erreurs lancées au gestionnaire d'erreurs.

import type {Request, Response} from 'express';
import {gameService} from '../services/game.service.js';

export function listGames(_req: Request, res: Response) {
    res.status(200).json(gameService.list());
}

export function getGame(req: Request, res: Response) {
    res.status(200).json(gameService.get(req.params.id));
}

export function createGame(req: Request, res: Response) {
    res.status(201).json(gameService.create(req.body));
}

export function updateGame(req: Request, res: Response) {
    res.status(200).json(gameService.update(req.params.id, req.body));
}

export function deleteGame(req: Request, res: Response) {
    gameService.delete(req.params.id);
    res.status(204).send();
}
