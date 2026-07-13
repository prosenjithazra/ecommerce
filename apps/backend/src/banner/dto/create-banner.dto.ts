export class CreateBannerDto {
  badge?: string;
  headline1!: string;
  headline2!: string;
  headline2Color?: string;
  sub?: string;
  productImg?: string;
  bgImg?: string;
  headline1Color?: string;
  subColor?: string;
  badgeColor?: string;
  bg?: string;
  accent?: string;
  textDark?: boolean;
  isActive?: boolean;
  overlayColor?: string;
  badges?: { icon: string; label: string }[];
}
