// Type definitions for Google APIs Node.js Client
// Project: https://github.com/google/google-api-nodejs-client
// Definitions by: Robby Cornelissen <https://github.com/procrastinatos/>
// Definitions: https://github.com/procrastinatos/google-api-node-tsd

declare module google {
    export interface GoogleApis {
        cloudprint(options: any): cloudprint.Cloudprint;
    }

    namespace cloudprint {
        export interface Cloudprint {
            new(options: any): Cloudprint;

            printers: {
                search: (
                    parameters: {
                    q?: string,
                    type?: Printer.Type,
                    connection_status?: Printer.ConnectionStatus,
                    use_cdd?: string,
                    extra_fields?: any
                    },
                    callback: (
                        error: any,
                        body: PrintersResponse,
                        response: any
                    ) => void) => Request;
                get: (
                    parameters: {
                        printerid: string,
                        client?: string,
                        extra_fields?: any
                    },
                    callback: (
                        error: any,
                        body: Printer,
                        response: any
                    ) => void) => Request;
            };

            jobs: {
                // search: (parameters: {
                //     printerid?: string,
                //     owner?: string,
                //     status?: string,
                //     q?: string,
                //     offset? : number,
                //     limit?: number,
                //     sortorder?: any
                // }, callback: (error: any, body: Colors, response: any) => void) => Request;
                // delete: (parameters: {

                // }, callback: (error: any, body: Colors, response: any) => void) => Request;
                submit: (
                    parameters: { printerid: string,
                        title: string,
                        ticket: any,
                        content: string,
                        contentType? : any,
                        tag?: string
                    },
                    callback: (
                        error: any,
                        body: PrintersResponse,
                        response: any
                    ) => void) => Request;
            };
        }

        namespace Printer {
            enum Type {
                GOOGLE,
                HP,
                DOCS,
                DRIVE,
                FEDEX,
                ANDROID_CHROME_SNAPSHOT,
                IOS_CHROME_SNAPSHOT
            }

            enum ConnectionStatus {
                ONLINE,
                UNKNOWN,
                OFFLINE,
                DORMANT
            }
        }

        export interface PrintersResponse {
            success: boolean,
            request: any,
            message?: string,
            printers: Printer[],
            xsrf_token: string
        }

        export interface Printer {
            id: string;
            name: string;
            connectionStatus: string;
            defaultDisplayName: string;
            displayName: string;
            description: string;
            type: string;
            proxy: string;
            createTime: string;
            accessTime: string;
            updateTime: string;
            isTosAccepted: string;
            tags: string[];
            capabilities: string;
            capsFormat: string;
            capsHash: string;
            ownerId: string;
            ownerName: string;
            access: string;
            public: string;
            quotaEnabled: boolean;
            dailyQuota: number;
            currentQuota: number;
            local_settings: LocalSettings;
        }

        export interface LocalSetting {
            local_discovery: boolean,
            access_token_enabled: boolean,
            'printer/local_printing_enabled': boolean,
            'printer/conversion_printing_enabled': boolean,
            xmpp_timeout_value: number
        }

        export interface LocalSettings {
            local_settings: {
                [name: string]: LocalSetting
            }
        }
    }
}