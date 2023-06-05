import { cva } from 'class-variance-authority';
import Color from 'color';
import styled, { FlattenInterpolation, ThemeProps, css } from 'styled-components';
import theme from 'styled-theming';

import { color, media, transition, typography } from '../../../theme';
import { ColorScaleIndex, colorScale } from '../../../theme/utils/colorScale';
import { COLOR_SCALES_RECORD } from './button.constants';
import { ButtonColor, ButtonTheme, ButtonVariant } from './button.types';

export type ButtonThemeProps = ThemeProps<ButtonTheme>;

const extractPropsColorScale = ({ theme: { color } }: ButtonThemeProps) =>
  COLOR_SCALES_RECORD[color as ButtonColor] as (typeof COLOR_SCALES_RECORD)[ButtonColor] | undefined;

export const getColor = (props: ButtonThemeProps) => {
  const propsColorScale = extractPropsColorScale(props);
  return propsColorScale?.base ?? props.theme.color;
};

export const getColorScale = (index: ColorScaleIndex) => (props: ButtonThemeProps) => {
  const propsColorScale = extractPropsColorScale(props);
  const scale = propsColorScale ?? colorScale(props.theme.color);
  return scale.get(index);
};

export const getColorBasedOnColorPropDarkness = (props: ButtonThemeProps) => {
  const propsColor = getColor(props);
  return Color(propsColor).isDark() ? color.white : color.text;
};

const specialStates = ({
  hover,
  active,
  disabled,
  fixedWidth,
  fluidWidth,
}: {
  [key in 'hover' | 'active' | 'disabled' | 'fixedWidth' | 'fluidWidth']?: FlattenInterpolation<ButtonThemeProps>;
}) => css<ButtonThemeProps>`
  &:not(:disabled) {
    &:focus,
    &:hover {
      ${hover}
    }

    &:active {
      ${active}
    }
  }

  ${theme('fixedWidth', {
    true: fixedWidth,
    false: fluidWidth,
    undefined: fluidWidth,
  })}

  ${theme('isDisabled', {
    true: disabled,
  })};
`;

const fullShape = css<ButtonThemeProps>``;

const rawShape = css`
  padding: 0;
  height: auto;
`;

const primaryBaseButtonStyle = css`
  justify-content: center;
  ${fullShape};
  ${typography.labelBold};
  border-radius: 4px;
  color: ${getColorBasedOnColorPropDarkness};
  border: 1px solid ${getColor};
  background-color: ${getColor};

  ${specialStates({
    hover: css`
      background: ${getColorScale(65)};
    `,
    active: css`
      background: ${getColorScale(35)};
    `,
    disabled: css`
      background: ${color.greyScale.get(90)};
    `,
  })}
`;

const secondaryBaseButtonStyle = css`
  justify-content: center;
  ${fullShape};
  ${typography.labelBold};
  border-radius: 4px;
  color: ${getColor};
  border: 1px solid ${getColor};
  background-color: ${color.white};

  ${specialStates({
    hover: css`
      color: ${getColorScale(65)};
    `,
    active: css`
      color: ${getColorScale(35)};
    `,
  })}
`;

const rawBaseButtonStyle = css`
  justify-content: center;
  ${rawShape};
  ${typography.labelBold};
  border-radius: 4px;
  color: ${getColor};
  border: none;
  background-color: transparent;

  ${specialStates({
    hover: css`
      color: ${getColorScale(65)};
    `,
    active: css`
      color: ${getColorScale(35)};
    `,
    fixedWidth: css`
      width: auto;
      min-width: 0;
    `,
    fluidWidth: css`
      width: auto;
      max-width: none;
    `,
  })}
`;

const flatBaseButtonStyle = css`
  justify-content: flex-start;
  ${fullShape};
  ${typography.label};
  border-radius: 0;
  color: ${color.text};
  border: none;
  background-color: ${color.white};

  ${specialStates({
    hover: css`
      background: ${getColorScale(98)};
      color: ${getColorScale(15)};
    `,
    active: css`
      background: ${getColorScale(95)};
      color: ${getColorScale(35)};
    `,
  })}
`;

const roundBaseButtonStyle = css`
  color: ${getColor};
  border-radius: 100%;
  width: 32px !important;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  background-color: transparent;

  ${specialStates({
    hover: css`
      background: ${getColorScale(98)};
    `,
    active: css`
      background: ${getColorScale(95)};
      color: ${getColorScale(35)};
    `,
    disabled: css`
      opacity: 0.4;
    `,
  })}
`;

export const baseButtonStyle = css<ButtonThemeProps>`
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: background-color ${transition.primary}, border-color ${transition.primary}, color ${transition.primary};

  ${specialStates({
    hover: css<ButtonThemeProps>`
      border-color: ${getColorScale(65)};
    `,
    active: css`
      border-color: ${getColorScale(35)};
    `,
    disabled: css<ButtonThemeProps>`
      color: ${color.greyScale.get(70)} !important;
      border-color: ${color.greyScale.get(90)} !important;
    `,
    fluidWidth: css<ButtonThemeProps>`
      width: 100%;
      max-width: 342px;

      ${media.media(media.Breakpoint.TABLET)`
        width: auto;
      `};
    `,
    fixedWidth: css<ButtonThemeProps>`
      width: 100%;
      min-width: 288px;

      ${media.media(media.Breakpoint.TABLET)`
        width: auto;
      `};
    `,
  })}

  ${theme<ButtonTheme, ButtonVariant>('variant', {
    [ButtonVariant.PRIMARY]: primaryBaseButtonStyle,
    [ButtonVariant.SECONDARY]: secondaryBaseButtonStyle,
    [ButtonVariant.FLAT]: flatBaseButtonStyle,
    [ButtonVariant.GHOST]: rawBaseButtonStyle,
    [ButtonVariant.ROUND]: roundBaseButtonStyle,
  })};
`;

export const Icon = styled.span`
  margin-right: 4px;
  font-size: 0;
  display: inline-flex;
  align-items: center;
`;

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'underline-offset-4 hover:underline text-primary',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
