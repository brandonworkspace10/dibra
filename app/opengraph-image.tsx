import TwitterImage, {
  alt as twitterAlt,
  contentType as twitterContentType,
  size as twitterSize,
} from "./twitter-image";

export const alt = twitterAlt;
export const contentType = twitterContentType;
export const size = twitterSize;

export default function OpenGraphImage() {
  return TwitterImage();
}
