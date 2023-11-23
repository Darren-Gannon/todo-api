import { Board } from "../entities/board.entity";

export function BoardUserPermissions(boardId: Board['id']) {
    return {
        read: `board:${ boardId }:user:read`,
        write: `board:${ boardId }:user:write`,
    };
}