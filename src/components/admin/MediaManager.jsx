import { useRef, useState } from "react";
import { Trash2, ArrowUp, ArrowDown, Upload, Link2, Play, Loader2, RefreshCcw } from "lucide-react";
import toast from "react-hot-toast";
import { adminApi, getErrorMessage } from "../../lib/api.js";
import { mediaUrl } from "../../lib/media.js";

function detectPlatform(url) {
  if (/tiktok\.com/i.test(url)) return "tiktok";
  if (/instagram\.com/i.test(url)) return "instagram";
  return null;
}

export function ImageManager({ images, onChange }) {
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const addUrl = () => {
    if (!urlInput.trim()) return;
    onChange([...images, { url: urlInput.trim(), alt: "", order: images.length }]);
    setUrlInput("");
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("files", f));
      const { data } = await adminApi.post("/upload", formData);
      const newImages = data.files.filter((f) => f.type === "image").map((f, i) => ({ url: f.url, alt: "", order: images.length + i }));
      onChange([...images, ...newImages]);
      toast.success("Images uploaded.");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const move = (idx, dir) => {
    const next = [...images];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  };

  const remove = (idx) => onChange(images.filter((_, i) => i !== idx));

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {images.map((img, idx) => (
          <div key={idx} className="group relative aspect-square overflow-hidden rounded-md border border-cream-deep">
            <img src={mediaUrl(img.url)} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center gap-1 bg-ink/0 opacity-0 transition group-hover:bg-ink/50 group-hover:opacity-100">
              <button type="button" onClick={() => move(idx, -1)} className="rounded-full bg-white/90 p-1.5"><ArrowUp size={12} /></button>
              <button type="button" onClick={() => move(idx, 1)} className="rounded-full bg-white/90 p-1.5"><ArrowDown size={12} /></button>
              <button type="button" onClick={() => remove(idx)} className="rounded-full bg-white/90 p-1.5 text-red-600"><Trash2 size={12} /></button>
            </div>
            {idx === 0 && <span className="absolute left-1 top-1 rounded-sm bg-ink px-1.5 py-0.5 text-[9px] text-ivory">Main</span>}
          </div>
        ))}
        <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-cream-deep text-ink-soft hover:border-gold hover:text-gold">
          <Upload size={18} />
          <span className="text-[10px]">{uploading ? "Uploading..." : "Upload"}</span>
          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={handleUpload} disabled={uploading} />
        </label>
      </div>
      <div className="mt-3 flex gap-2">
        <input
          placeholder="Or paste an image URL..."
          className="input text-xs"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUrl())}
        />
        <button type="button" onClick={addUrl} className="flex items-center gap-1 whitespace-nowrap rounded-sm border border-cream-deep px-3 text-xs text-ink-soft hover:border-gold hover:text-gold">
          <Link2 size={12} /> Add
        </button>
      </div>
    </div>
  );
}

const videoTypes = ["demo", "worn", "styling", "closeup", "tiktok"];

export function VideoManager({ videos, onChange }) {
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [fetchingIdx, setFetchingIdx] = useState(null);
  const fileRef = useRef(null);

  const fetchThumbnail = async (idx, url, list) => {
    const platform = detectPlatform(url);
    if (!platform) return;
    setFetchingIdx(idx);
    try {
      const { data } = await adminApi.get("/content/resolve", { params: { url, platform } });
      const next = [...list];
      next[idx] = { ...next[idx], thumbnail: data.thumbnail || next[idx].thumbnail, title: next[idx].title || data.caption || "" };
      onChange(next);
      toast.success(`Thumbnail fetched from ${platform === "instagram" ? "Instagram" : "TikTok"}.`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setFetchingIdx(null);
    }
  };

  const addUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    const newVideos = [...videos, { url, thumbnail: "", title: "", type: "demo", order: videos.length }];
    onChange(newVideos);
    setUrlInput("");
    fetchThumbnail(newVideos.length - 1, url, newVideos);
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("files", f));
      const { data } = await adminApi.post("/upload", formData);
      const newVideos = data.files.filter((f) => f.type === "video").map((f, i) => ({ url: f.url, thumbnail: "", title: "", type: "demo", order: videos.length + i }));
      onChange([...videos, ...newVideos]);
      toast.success("Videos uploaded.");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const update = (idx, key, value) => {
    const next = [...videos];
    next[idx] = { ...next[idx], [key]: value };
    onChange(next);
  };

  const move = (idx, dir) => {
    const next = [...videos];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  };

  const remove = (idx) => onChange(videos.filter((_, i) => i !== idx));

  return (
    <div className="space-y-3">
      {videos.map((v, idx) => {
        const platform = detectPlatform(v.url);
        return (
          <div key={idx} className="rounded-md border border-cream-deep p-3">
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={v.url}
                target="_blank"
                rel="noreferrer"
                title="Open the real video"
                className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-cream-deep text-ink-soft hover:opacity-80"
              >
                {v.thumbnail ? <img src={mediaUrl(v.thumbnail)} alt="" className="h-full w-full object-cover" /> : <Play size={16} />}
              </a>
              <input placeholder="Video title" className="input flex-1 text-xs" value={v.title} onChange={(e) => update(idx, "title", e.target.value)} />
              <select className="select w-32 text-xs" value={v.type} onChange={(e) => update(idx, "type", e.target.value)}>
                {videoTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <button type="button" onClick={() => move(idx, -1)} className="text-ink-soft hover:text-gold"><ArrowUp size={14} /></button>
              <button type="button" onClick={() => move(idx, 1)} className="text-ink-soft hover:text-gold"><ArrowDown size={14} /></button>
              <button type="button" onClick={() => remove(idx)} className="text-ink-soft hover:text-red-600"><Trash2 size={14} /></button>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <input
                placeholder="Thumbnail image URL"
                className="input flex-1 text-xs"
                value={v.thumbnail}
                onChange={(e) => update(idx, "thumbnail", e.target.value)}
              />
              {platform && (
                <button
                  type="button"
                  onClick={() => fetchThumbnail(idx, v.url, videos)}
                  disabled={fetchingIdx === idx}
                  className="flex items-center gap-1 whitespace-nowrap rounded-sm border border-cream-deep px-3 py-2.5 text-xs text-ink-soft hover:border-gold hover:text-gold disabled:opacity-50"
                >
                  {fetchingIdx === idx ? <Loader2 size={12} className="animate-spin" /> : <RefreshCcw size={12} />} Fetch from{" "}
                  {platform === "instagram" ? "Instagram" : "TikTok"}
                </button>
              )}
            </div>
          </div>
        );
      })}
      <div className="flex flex-wrap gap-2">
        <label className="flex cursor-pointer items-center gap-1.5 rounded-sm border border-dashed border-cream-deep px-4 py-2.5 text-xs text-ink-soft hover:border-gold hover:text-gold">
          <Upload size={13} /> {uploading ? "Uploading..." : "Upload Video"}
          <input ref={fileRef} type="file" accept="video/*" multiple hidden onChange={handleUpload} disabled={uploading} />
        </label>
        <input
          placeholder="Or paste a TikTok or Instagram video link..."
          className="input flex-1 text-xs"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUrl())}
        />
        <button type="button" onClick={addUrl} className="flex items-center gap-1 whitespace-nowrap rounded-sm border border-cream-deep px-3 text-xs text-ink-soft hover:border-gold hover:text-gold">
          <Link2 size={12} /> Add
        </button>
      </div>
    </div>
  );
}
