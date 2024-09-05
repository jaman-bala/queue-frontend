import { Button as ButtonUI } from '@headlessui/react';
import { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import cls from './button.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    classNames?: string;
    disabled?: boolean;
    loading?: boolean;
    children?: ReactNode;
}

export const Button = (props: ButtonProps) => {
    const { children, classNames, disabled, loading, ...otherProps } = props;

    const modes = {
        [cls.disabled]: disabled,
        [cls.loading]: loading,
    };

    const content = loading ? <span className={cls.loader}></span> : children;
    return (
        <ButtonUI
            className={clsx(cls.button, classNames, modes)}
            disabled={disabled || loading}
            {...otherProps}
        >
            {content}
        </ButtonUI>
    );
};
