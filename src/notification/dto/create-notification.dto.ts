import { Notification } from "../entities/notification.entity";

export class CreateNotificationDto {

    constructor(
        public readonly title: Notification['title'],
        public readonly data: Notification['data'],
        public readonly type: Notification['type'],
    ) { }
}
