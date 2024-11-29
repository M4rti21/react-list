import { useState } from "react";

export type Filter<T> = {
    name: string;
    desc?: string;
    action: (a: T) => boolean;
};

export type Sorter<T> = {
    name: string;
    desc?: string;
    action: (a: T, b: T) => number;
};

export type Searcher<T> = {
    name: string;
    desc?: string;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    action: (a: T) => boolean;
};

export type ItemsContainer = React.FC<{ children: React.ReactNode }>;

type Props<T> = {
    items: T[];
    filters?: Filter<T>[];
    sorters?: Sorter<T>[];
    searchers?: Searcher<T>[];
    itemsContainer: React.ComponentType<{ children: React.ReactNode }>;
    render: (a: T, i: number) => JSX.Element;
};

const defaultSorter = { name: "defaultSorter", action: () => 0 };

function FilterList<T>({
    items,
    filters,
    sorters,
    searchers,
    itemsContainer: ItemsContainer,
    render,
}: Props<T>) {
    const [activeFilters, setActiveFilters] = useState<Filter<T>[]>([]);
    const [activeSorter, setActiveSorter] = useState<Sorter<T>>(defaultSorter);

    function applyFilters() {
        let newItems = items;
        for (const f of activeFilters) {
            newItems = newItems.filter(f.action);
        }
        if (searchers) {
            for (const s of searchers) {
                newItems = newItems.filter(s.action);
            }
        }
        return newItems.sort(activeSorter.action);
    }

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
            <ItemsContainer>{applyFilters().map(render)}</ItemsContainer>
        </div>
    );
}

export default FilterList;
