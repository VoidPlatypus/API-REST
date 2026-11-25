import { db } from '../database/database.js';
import { Game, type CreateGameInput } from '../models/game.model.js';

interface GameRow {
    id: number;
    title: string;
    editor: string;
    release_year: number;
    genre: string;
    rating: number;
}

const toGame = (row: GameRow): Game =>
    new Game(row.id, row.title, row.editor, row.release_year, row.genre, row.rating);

const selectAll = db.prepare('SELECT * FROM games');
const selectById = db.prepare('SELECT * FROM games WHERE id = ?');
const insert = db.prepare(
    'INSERT INTO games (title, editor, release_year, genre, rating) VALUES (@title, @editor, @releaseYear, @genre, @rating)',
);
const update = db.prepare(
    'UPDATE games SET title = @title, editor = @editor, release_year = @releaseYear, genre = @genre, rating = @rating WHERE id = @id',
);
const remove = db.prepare('DELETE FROM games WHERE id = ?');

export const gameRepository = {
    findAll(): Game[] {
        return (selectAll.all() as GameRow[]).map(toGame);
    },

    findById(id: number): Game | undefined {
        const row = selectById.get(id) as GameRow | undefined;
        return row ? toGame(row) : undefined;
    },

    create(input: CreateGameInput): Game {
        const result = insert.run(input);
        return new Game(
            Number(result.lastInsertRowid),
            input.title,
            input.editor,
            input.releaseYear,
            input.genre,
            input.rating,
        );
    },

    /** Retourne le jeu modifié, ou undefined si l'id n'existe pas. */
    update(id: number, input: CreateGameInput): Game | undefined {
        const result = update.run({ ...input, id });
        return result.changes > 0 ? new Game(id, input.title, input.editor, input.releaseYear, input.genre, input.rating) : undefined;
    },

    /** Retourne true si un jeu a été supprimé. */
    delete(id: number): boolean {
        return remove.run(id).changes > 0;
    },
};
