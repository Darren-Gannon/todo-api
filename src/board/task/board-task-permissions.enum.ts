import { Board } from "../entities/board.entity";

export function BoardTaskPermissions(boardId: Board['id']) {
    return {
        read: `board:${ boardId }:task:read`,
        write: `board:${ boardId }:task:write`,
    };
}