import clsx from 'clsx';
import { InputHTMLAttributes } from 'react';
import { Input as InputUI } from '@headlessui/react';
import cls from './input.module.scss';

type HTMLInputProps = Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'value' | 'onChange' | 'readOnly'
>;

interface InputProps extends HTMLInputProps {
    classNames?: string;
    value?: string | number;
    onChange?: (value: string) => void;
    readonly?: boolean;
    label?: string;
    disabled?: boolean;
}

export const Input = (props: InputProps) => {
    const {
        classNames,
        readonly,
        value,
        onChange,
        label,
        disabled,
        ...otherProps
    } = props;
    const modes = {
        [cls.readonly]: readonly,
        [cls.disabled]: disabled,
    };
    const labelElem = label && <p className={cls.label}>{label}</p>;
    return (
        <div>
            {/* {labelElem} */}
            <InputUI
                className={clsx(cls.input, classNames, modes)}
                value={value}
                disabled={disabled}
                onChange={(e) => onChange?.(e.target.value)}
                readOnly={readonly}
                placeholder={label}
                {...otherProps}
            />
        </div>
    );
};
