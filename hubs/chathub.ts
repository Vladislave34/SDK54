import * as signalR from "@microsoft/signalr";
import {BASE_URL} from "@/env";


let connection: signalR.HubConnection | null = null;

export const createChatConnection = (token: string) => {
    connection = new signalR.HubConnectionBuilder()
        .withUrl(`${BASE_URL.baseUrl}/hubs/chat`, {
            accessTokenFactory: () => token,
        })
        .withAutomaticReconnect()
        .build();

    return connection;
};

export const getChatConnection = () => connection;
