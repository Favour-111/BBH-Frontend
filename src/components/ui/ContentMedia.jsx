export default function ContentMedia({ item, className }) {
  if (item.thumbnail) {
    return <img src={item.thumbnail} alt={item.title} loading="lazy" className={className} />;
  }
  if (item.video) {
    return <video src={item.video} muted playsInline preload="metadata" className={className} />;
  }
  return <div className={className} />;
}
