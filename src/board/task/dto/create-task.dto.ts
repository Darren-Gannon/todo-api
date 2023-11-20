import { Board } from "../../../board/entities/board.entity";
import { State } from "../../state/entities/state.entity";

export class CreateTaskDto {
    id?: string;
    title: string;
    description: string;
    boardId: Board['id']
    stateId: State['id']
}
