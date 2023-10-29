import { Notification } from "../entities/notification.entity";

export class UpdateNotificationDto {

    constructor(
        public readonly read: Notification['read'],
    ) { }
}
