import FilterList, { Filter, Searcher, Sorter } from "./FilterList";
import { faker } from "@faker-js/faker";
import { useEffect, useState } from "react";

type Person = {
    name: string;
    lastName: string;
    age: number;
};

function getPersonList(ammount: number) {
    const people: Person[] = [];
    for (let i = 0; i < ammount; i++) {
        people.push({
            name: faker.person.firstName(),
            lastName: faker.person.lastName(),
            age: faker.number.int({ min: 12, max: 99 }),
        });
    }
    return people;
}

function App() {
    const [people, setPeople] = useState<Person[]>([]);

    const [nameSearchValue, setNameSearchValue] = useState("");
    const [lastNameSearchValue, setLastNameSearchValue] = useState("");

    useEffect(() => {
        setPeople(getPersonList(1000));
    }, []);

    const peopleFilters: Filter<Person>[] = [
        {
            name: "starts with J",
            action: (p) => p.name.toLowerCase().startsWith("j"),
        },
        {
            name: "Age > 30",
            action: (p) => p.age > 30,
        },
        {
            name: "Age < 50",
            action: (p) => p.age < 50,
        },
    ];

    const peopleSorters: Sorter<Person>[] = [
        {
            name: "by name (asc)",
            action: (a, b) => a.name.localeCompare(b.name),
        },
        {
            name: "by name (des)",
            action: (a, b) => b.name.localeCompare(a.name),
        },
        {
            name: "by age (asc)",
            action: (a, b) => a.age - b.age,
        },
        {
            name: "by age (des)",
            action: (a, b) => b.age - a.age,
        },
    ];

    const peopleSearchers: Searcher<Person>[] = [
        {
            name: "Name",
            value: nameSearchValue,
            setValue: setNameSearchValue,
            action: (p) =>
                p.name.toLowerCase().includes(nameSearchValue.toLowerCase()),
        },
        {
            name: "Last Name",
            value: lastNameSearchValue,
            setValue: setLastNameSearchValue,
            action: (p) =>
                p.lastName
                    .toLowerCase()
                    .includes(lastNameSearchValue.toLowerCase()),
        },
    ];

    return (
        <div className="p-8">
            <FilterList<Person>
                items={people}
                filters={peopleFilters}
                sorters={peopleSorters}
                searchers={peopleSearchers}
                itemsContainer={({ children }) => (
                    <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                        <thead className="ltr:text-left rtl:text-right">
                            <tr>
                                <th></th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                    Name
                                </th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                    Last Name
                                </th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                    Age
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {children}
                        </tbody>
                    </table>
                )}
                render={(p, i) => (
                    <tr key={i} className="odd:bg-gray-50">
                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                            #{i + 1}
                        </th>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                            {p.name}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                            {p.lastName}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                            {p.age}
                        </td>
                    </tr>
                )}
            />
            {/* <FilterList<Person> */}
            {/*     items={people} */}
            {/*     filters={peopleFilters} */}
            {/*     sorters={peopleSorters} */}
            {/*     itemsContainer={({ children }) => ( */}
            {/*         <div */}
            {/*             style={{ */}
            {/*                 display: "flex", */}
            {/*                 flexDirection: "row", */}
            {/*                 gap: "10px", */}
            {/*             }} */}
            {/*         > */}
            {/*             {children} */}
            {/*         </div> */}
            {/*     )} */}
            {/*     render={(p) => ( */}
            {/*         <ul> */}
            {/*             <li style={{ textWrap: "nowrap" }}>Name: {p.name}</li> */}
            {/*             <li style={{ textWrap: "nowrap" }}> */}
            {/*                 Last Name: {p.lastName} */}
            {/*             </li> */}
            {/*             <li style={{ textWrap: "nowrap" }}>Age: {p.age}</li> */}
            {/*         </ul> */}
            {/*     )} */}
            {/* /> */}
        </div>
    );
}

export default App;
