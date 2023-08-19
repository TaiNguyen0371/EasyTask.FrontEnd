import { ITask } from "./task";

export interface IListTask {
    _id: string,
    name: string,
    idWorkSpace: string,
    tasks: ITask[],
    index: number
}
