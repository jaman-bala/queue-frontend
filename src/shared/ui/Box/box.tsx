import clsx from 'clsx';
import cls from './box.module.scss';
import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

export type FlexJustify = 'start' | 'center' | 'end' | 'between';
export type FlexAlign = 'start' | 'center' | 'end';
export type FlexDirection = 'row' | 'column';

const justifyClasses: Record<FlexJustify, string> = {
    start: cls.justifyStart,
    center: cls.justifyCenter,
    end: cls.justifyEnd,
    between: cls.justifyBetween,
};

const alignClasses: Record<FlexAlign, string> = {
    start: cls.alignStart,
    center: cls.alignCenter,
    end: cls.alignEnd,
};

const directionClasses: Record<FlexDirection, string> = {
    row: cls.directionRow,
    column: cls.directionColumn,
};

type DivProps = DetailedHTMLProps<
    HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
>;

interface BoxProps extends DivProps {
    classNames?: string;
    children: ReactNode;
    justify?: FlexJustify;
    align?: FlexAlign;
    direction?: FlexDirection;
    card?: boolean;
    shadow?: boolean;
    fullWidth?: boolean;
}

export const Box = (props: BoxProps) => {
    const {
        children,
        classNames,
        justify = 'start',
        align = 'center',
        direction = 'row',
        card,
        shadow,
        fullWidth,
    } = props;
    const layoutModes = [
        justifyClasses[justify],
        alignClasses[align],
        directionClasses[direction],
    ];
    const modes = {
        [cls.card]: card,
        [cls.shadow]: shadow,
        [cls.fullWidth]: fullWidth,
    };
    return (
        <div className={clsx(classNames, cls.box, layoutModes, modes)}>
            {children}
        </div>
    );
};
