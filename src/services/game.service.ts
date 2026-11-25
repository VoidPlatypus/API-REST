// Règles métier : validation des données puis délégation au repository.

import {gameRepository} from '../repositories/game.repository.js';
import type {CreateGameInput, Game} from '../models/game.model.js';

// Erreur HTTP avec un code de statut et des détails facultatifs.
export class HttpError extends Error {
    constructor(
        public status: number,
        message: string,
        public details?: string[],
    ) {
        super(message);
        this.name = 'HttpError';
    }
}

// Vérifie que l'identifiant est un entier strictement positif.
function parseId(raw: unknown): number {
    if (typeof raw !== 'string' || !/^[1-9]\d*$/.test(raw)) {
        throw new HttpError(400, 'Identifiant invalide');
    }
    const id = Number(raw);
    if (!Number.isSafeInteger(id)) {
        throw new HttpError(400, 'Identifiant invalide');
    }
    return id;
}

const isNonEmptyString = (v: unknown): v is string => typeof v === 'string' && v.trim() !== '';

// Valide le corps reçu et renvoie des données nettoyées.
function validateGame(body: unknown): CreateGameInput {
    const data = (typeof body === 'object' && body !== null ? body : {}) as Record<string, unknown>;
    const errors: string[] = [];

    if (!isNonEmptyString(data.title)) errors.push('Le titre est obligatoire');
    if (!isNonEmptyString(data.editor)) errors.push("L'éditeur est obligatoire");
    if (!isNonEmptyString(data.genre)) errors.push('Le genre est obligatoire');
    if (typeof data.rating !== 'number' || !Number.isFinite(data.rating) || data.rating < 0 || data.rating > 10) {
        errors.push('La note doit être comprise entre 0 et 10');
    }
    if (
        typeof data.releaseYear !== 'number' ||
        !Number.isInteger(data.releaseYear) ||
        data.releaseYear < 1950 ||
        data.releaseYear > 2100
    ) {
        errors.push("L'année de sortie doit être un entier compris entre 1950 et 2100");
    }

    if (errors.length > 0) {
        throw new HttpError(400, 'Données invalides', errors);
    }
    return {
        title: (data.title as string).trim(),
        editor: (data.editor as string).trim(),
        releaseYear: data.releaseYear as number,
        genre: (data.genre as string).trim(),
        rating: data.rating as number,
    };
}

export const gameService = {
    list(): Game[] {
        return gameRepository.findAll();
    },

    get(rawId: unknown): Game {
        const game = gameRepository.findById(parseId(rawId));
        if (!game) throw new HttpError(404, 'Jeu introuvable');
        return game;
    },

    create(body: unknown): Game {
        return gameRepository.create(validateGame(body));
    },

    update(rawId: unknown, body: unknown): Game {
        const id = parseId(rawId);
        if (!gameRepository.findById(id)) throw new HttpError(404, 'Jeu introuvable');
        const game = gameRepository.update(id, validateGame(body));
        if (!game) throw new HttpError(404, 'Jeu introuvable');
        return game;
    },

    delete(rawId: unknown): void {
        if (!gameRepository.delete(parseId(rawId))) {
            throw new HttpError(404, 'Jeu introuvable');
        }
    },
};
