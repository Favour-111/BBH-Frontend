import { mediaUrl } from "../../lib/media.js";

export default function ContentMedia({ item, className }) {
  if (item.thumbnail) {
    return <img src={mediaUrl(item.thumbnail)} alt={item.title} loading="lazy" className={className} />;
  }
  if (item.video) {
    return <video src={mediaUrl(item.video)} muted playsInline preload="metadata" className={className} />;
  }
  return <div className={className} />;
}
