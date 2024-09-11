import { FC, memo, SVGProps } from 'react';
import clsx from 'clsx';
import cls from './icon.module.scss';

interface IconProps extends SVGProps<SVGSVGElement> {
    classNames?: string;
    Svg: string | FC<SVGProps<SVGSVGElement>>;
}

export const Icon = memo((props: IconProps) => {
    const { Svg, classNames, ...otherProps } = props;
    return <Svg className={clsx(cls.icon, classNames)} {...otherProps} />;
});
