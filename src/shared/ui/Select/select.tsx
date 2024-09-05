import clsx from 'clsx';
import cls from './select.module.scss';
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from '@headlessui/react';
import { useState } from 'react';

interface SelectOption {
    content: string;
    value: string;
}

interface SelectProps {
    onChange: (item: string) => void;
    classNames?: string;
    items: SelectOption[];
}

export const Select = (props: SelectProps) => {
    const { onChange, classNames, items } = props;
    const [selectedValue, setSelectedValue] = useState<string>(
        items[0].content,
    );

    const onChangeHandler = (value: string) => {
        setSelectedValue(value);
        onChange(value);
    };

    return (
        <Listbox value={selectedValue} onChange={onChangeHandler}>
            <ListboxButton className={cls.listbutton}>
                {selectedValue}
            </ListboxButton>
            <ListboxOptions anchor="bottom">
                {items.map((person) => (
                    <ListboxOption
                        key={person.value}
                        value={person}
                        className={cls.listoption}
                    >
                        {person.content}
                    </ListboxOption>
                ))}
            </ListboxOptions>
        </Listbox>
    );
};
