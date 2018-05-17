export class User {
    id?: string;
    name: string;
    image?: string;
    mantra?: string;
    constructor(name: string) { this.name = name }
}

export class Message {
    from: User;
    content: string;
    group?: string
    constructor(from: User, content: string, group?: string) { }
}


export class PrivateMessage {
    from: User;
    to: User;
    content: string;
    group: string;
    senderImage: string
}

export class ChatMessage extends Message {
    constructor(from: User, content: string, group: string) {
        super(from, content, group);
    }
}

export enum Action {
    JOINED,
    LEFT,
    RENAME
}

// Socket.io events
export enum SocketEvent {
    CONNECT = 'connect',
    DISCONNECT = 'disconnect',
    JOIN = 'join',
    GROUP_MESSAGE = 'group message',
    ONLINE_GROUP_USERS = 'online group users',
    FRIEND_REQUEST_SEND = 'friendRequest send',
    FRIEND_REQUEST_RECEIVE = 'friendRequest receive',
    ONLINE_FRIENDS = 'online friends',
    PRIVATE_MESSAGE_RECEIVE = 'private message receive',
    PRIVATE_MESSAGE_NOTIFICATION = 'new private message notification',

}