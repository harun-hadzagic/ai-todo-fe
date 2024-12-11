export enum Priority {
    HIGH = "High",
    NORMAL = "Normal",
}

export enum Status {
    COMPLETED = "Completed",
    ONGOING = "Ongoing",
}

export interface Task {
    id: number;
    title: string;
    description: string;
    dueDate: string;
    priority: Priority;
    status: Status;
    category: {
        id: number;
        name: string;
    };
}
