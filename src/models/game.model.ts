export class Game {
    constructor(
        public id: number,
        public title: string,
        public editor: string,
        public releaseYear: number,
        public genre: string,
        public rating: number,
    ) {}
}

export type CreateGameInput = Omit<Game, 'id'>;