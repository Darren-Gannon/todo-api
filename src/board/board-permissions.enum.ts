import { Board } from "./entities/board.entity";

export function BoardPermissions(boardId: Board['id']) {
    return {
        read: `board:${ boardId }:read`,
        write: `board:${ boardId }:write`,
    };
}