import { Board } from "../entities/board.entity";

export function BoardStatePermissions(boardId: Board['id']) {
    return {
        read: `board:${ boardId }:state:read`,
        write: `board:${ boardId }:state:write`,
    };
}