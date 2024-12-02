import { faker } from "@faker-js/faker";
import LocalList, {
    LocalFilter,
    LocalSearcher,
    LocalSorter,
} from "./LocalList";

import { useEffect, useState } from "react";

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

type Person = {
    name: string;
    lastName: string;
    age: number;
};

function LocalListExample() {
    const [people, setPeople] = useState<Person[]>([]);

    const [nameSearchValue, setNameSearchValue] = useState("");
    const [lastNameSearchValue, setLastNameSearchValue] = useState("");

    useEffect(() => {
        setPeople(getPersonList(1000));
    }, []);

    const peopleFilters: LocalFilter<Person>[] = [
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

    const peopleSorters: LocalSorter<Person>[] = [
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

    const peopleSearchers: LocalSearcher<Person>[] = [
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
            <LocalList<Person>
                items={people}
                filters={peopleFilters}
                sorters={peopleSorters}
                searchers={peopleSearchers}
                itemsContainer={({ children }) => (
                    <div className="overflow-x-scroll">
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
                    </div>
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
        </div>
    );
}

export default LocalListExample;
