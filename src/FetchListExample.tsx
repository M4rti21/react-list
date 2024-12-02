import { useState } from "react";
import FetchList, {
    FetchFilter,
    FetchSearcher,
    FetchSorter,
} from "./FetchList";

type Post = {
    userId: number;
    id: number;
    title: string;
    body: string;
};

function FetchListExample() {
    const url = "https://jsonplaceholder.typicode.com/posts";

    const [searchTitle, setSearchTitle] = useState<string>("");

    const postSearchers: FetchSearcher[] = [
        {
            name: "Title",
            value: searchTitle,
            setValue: setSearchTitle,
            action: () => ({
                key: "title",
                val: searchTitle,
            }),
        },
    ];

    const postFilters: FetchFilter[] = [
        {
            name: "uid > 10",
            query: {
                key: "uid",
                val: "gt-10",
            },
        },
        {
            name: "uid < 10",
            query: {
                key: "uid",
                val: "lt-10",
            },
        },
    ];

    const postSorters: FetchSorter[] = [
        {
            name: "title (asc)",
            query: {
                key: "title",
                val: "asc",
            },
        },
        {
            name: "title (desc)",
            query: {
                key: "title",
                val: "desc",
            },
        },
    ];

    return (
        <FetchList<Post>
            url={url}
            sorters={postSorters}
            filters={postFilters}
            searchers={postSearchers}
            itemsContainer={({ children }) => (
                <div className="grid grid-cols-2 gap-4 p-4 overflow-x-scroll">
                    {children}
                </div>
            )}
            render={(item) => (
                <div className="border rounded-lg p-4">
                    <h2 className="font-bold text-xl">{item.title}</h2>
                    <p>{item.body}</p>
                </div>
            )}
        />
    );
}

export default FetchListExample;
