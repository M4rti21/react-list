import { useEffect, useState } from "react";

export type FetchQuery = {
    key: string;
    val: string;
};

export type FetchFilter = {
    name: string;
    desc?: string;
    query: FetchQuery;
};

export type FetchSorter = {
    name: string;
    desc?: string;
    query: FetchQuery;
};

export type FetchSearcher = {
    name: string;
    desc?: string;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    action: () => FetchQuery;
};

export type ItemsContainer = React.FC<{ children: React.ReactNode }>;

type Props<T> = {
    url: string;
    filters?: FetchFilter[];
    sorters?: FetchSorter[];
    searchers?: FetchSearcher[];
    itemsContainer: React.ComponentType<{ children: React.ReactNode }>;
    render: (a: T, i: number) => JSX.Element;
};

const defaultSorter = { name: "", query: { key: "", val: "" } };

function FetchList<T>({
    url,
    filters,
    sorters,
    searchers,
    itemsContainer: ItemsContainer,
    render,
}: Props<T>) {
    const [activeFilters, setActiveFilters] = useState<FetchFilter[]>([]);
    const [activeSorter, setActiveSorter] =
        useState<FetchSorter>(defaultSorter);

    const [items, setItems] = useState<T[]>([]);

    useEffect(() => {
        fetchItems();
        async function fetchItems() {
            const fetch_url = new URL(url);

            for (const f of activeFilters) {
                if (!f.query.key) continue;
                fetch_url.searchParams.set(f.query.key, f.query.val);
            }
            if (searchers) {
                for (const s of searchers) {
                    const query = s.action();
                    fetch_url.searchParams.set(query.key, query.val);
                }
            }
            if (activeSorter.query.key) {
                fetch_url.searchParams.set(
                    activeSorter.query.key,
                    activeSorter.query.val
                );
            }

            const res = await fetch(fetch_url.toString());
            if (!res.ok) return;
            const data = await res.json();
            if (!data) return;
            setItems(data);
        }
    }, [url, searchers, activeFilters, activeSorter]);

    return (
        <div>
            <div className="flex flex-col gap-4">
                {searchers ? (
                    <>
                        <div>Buscar:</div>
                        <fieldset className="flex gap-3">
                            {searchers.map((s, i) => (
                                <label
                                    key={i}
                                    className="flex cursor-pointer text-nowrap items-center justify-center rounded-md border border-gray-100 bg-white px-3 py-2 text-gray-900 hover:border-gray-200"
                                >
                                    <span>{s.name}</span>
                                    <input
                                        type="text"
                                        value={s.value}
                                        onChange={(e) =>
                                            s.setValue(e.target.value)
                                        }
                                    />
                                </label>
                            ))}
                        </fieldset>
                    </>
                ) : null}
                {filters ? (
                    <>
                        <div>Filtros:</div>
                        <fieldset className="flex gap-3">
                            {filters.map((f, i) => (
                                <label
                                    key={i}
                                    className="flex cursor-pointer text-nowrap items-center justify-center rounded-md border border-gray-100 bg-white px-3 py-2 text-gray-900 hover:border-gray-200 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-500 has-[:checked]:text-white"
                                >
                                    <span>{f.name}</span>
                                    <input
                                        hidden
                                        type="checkbox"
                                        value={f.name}
                                        checked={activeFilters.includes(f)}
                                        onChange={() => {}}
                                        onClick={() =>
                                            activeFilters.includes(f)
                                                ? setActiveFilters((prev) =>
                                                      prev.filter(
                                                          (filter) =>
                                                              filter !== f
                                                      )
                                                  )
                                                : setActiveFilters((prev) => [
                                                      ...prev,
                                                      f,
                                                  ])
                                        }
                                    />
                                </label>
                            ))}
                        </fieldset>
                    </>
                ) : null}

                {sorters ? (
                    <>
                        <div>Ordenar:</div>
                        <fieldset className="flex gap-3">
                            {sorters.map((s, i) => (
                                <label
                                    key={i}
                                    className="flex cursor-pointer text-nowrap items-center justify-center rounded-md border border-gray-100 bg-white px-3 py-2 text-gray-900 hover:border-gray-200 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-500 has-[:checked]:text-white"
                                >
                                    <span>{s.name}</span>
                                    <input
                                        hidden
                                        type="radio"
                                        name="sorter"
                                        value={s.name}
                                        checked={activeSorter === s}
                                        onChange={() => {}}
                                        onClick={() => setActiveSorter(s)}
                                    />
                                </label>
                            ))}
                        </fieldset>
                    </>
                ) : null}
            </div>
            <ItemsContainer>{items.map(render)}</ItemsContainer>
        </div>
    );
}

export default FetchList;
