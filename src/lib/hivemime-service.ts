import { toast } from "sonner"
import Cookies from "js-cookie";
import { Post } from "@/models/post";

export class HiveMimeService {
    private baseUrl: string = "https://api.hivemime.com";

    public async browsePostsAsync() : Promise<Post[]> {
        const posts = [];

        // Return dummy data for now.
        for (let i = 0; i < 5; i++) {
            const post = new Post();
            post.title = `Post ${i+1}`;
            post.content = `This is the content of post ${i+1}.`;
            posts.push(post);
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
        return posts;
    }

    private async sendRequestAsync(method: "GET" | "POST", endpoint: string, data?: unknown) : Promise<string> {
        try{
            if (method === "GET") {
                return this.getDataAsync(endpoint);
            }
            else {
                return this.postDataAsync(endpoint, data);
            }
        }
        catch (error: unknown) {
            toast.error(`Fetching ${endpoint} failed, please try again in a bit!`);

            if (error instanceof Error)
                toast.error(error.message);

            throw error;
        }
    }

    private async getDataAsync(endpoint: string) : Promise<string> {
        const headers = this.getDefaultHeaders();
        const response = await fetch(`${this.baseUrl}${endpoint}`, {headers});

        if (response.status != 200)
            throw new Error(`${response.statusText}. ${await response.text()}`);

        return response.text();
    }

    private async postDataAsync(endpoint: string, data: unknown) : Promise<string> {
        const headers = this.getDefaultHeaders();
        headers["Content-Type"] = "application/json";

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: "POST",
            headers,
            body: JSON.stringify(data)
        });

        if (response.status != 200)
            throw new Error(`${response.statusText}. ${await response.text()}`);

        return response.text();
    }
    
    private getDefaultHeaders() : Record<string,string>
    {
        const headers: Record<string,string> = {};
        const token = Cookies.get("access_token");

        // If we have an access token, use it to authenticate the request.
        if (token)
            headers["Authorization"] = `Bearer ${token}`;

        return headers;
    }
}