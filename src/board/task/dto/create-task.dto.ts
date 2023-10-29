import { Board } from "../../../board/entities/board.entity";
import { State } from "../../state/entities/state.entity";

export class CreateTaskDto {
    public title: string;
    public description: string;
    public boardId: Board['id']
    public stateId: State['id']
}
