export interface UnsplashItem {
  title: string;
  creationDate: Date;
  description?: string;
  imgFull: URL;
  imgRegular: URL;
  imgSmall: URL;
  imgThumb: URL;
  userName: string;
}
