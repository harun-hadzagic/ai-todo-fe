export interface Weather {
    id: number;
    title: string;
    description: string;
    dueDate: string;
    priority: string;
    status: string;
    category: {
        id: number;
        name: string;
    };
}
