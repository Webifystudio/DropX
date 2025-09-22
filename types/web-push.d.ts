
// This is a basic type definition file to satisfy TypeScript for web-push
// In a real project, you might want to find more complete @types/web-push or contribute to them.

declare module 'web-push' {
    export interface PushSubscription {
        endpoint: string;
        keys: {
            p256dh: string;
            auth: string;
        };
    }

    export interface VapidDetails {
        subject: string;
        publicKey: string;
        privateKey: string;
    }

    export interface SendResult {
        statusCode: number;
        body: string;
        headers: object;
    }

    export function setVapidDetails(subject: string, publicKey: string, privateKey: string): void;
    export function sendNotification(subscription: PushSubscription, payload?: string | Buffer, options?: object): Promise<SendResult>;
}
