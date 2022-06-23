export type User = {
    qqUnionID: string;
    username: string;
    avatarUrl: string;
    registeredAt: Date;
};

export type ToDoCollection = {
    uuid: string;
    owner: string;
    name: string;
    description: string;
    createdAt: Date;
};

export type ToDoItem = {
    uuid: string;
    inCollection: string;
    name: string;
    description: string;
    createdAt: Date;
    checked: boolean;
};