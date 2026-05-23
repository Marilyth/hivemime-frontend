import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import imageCompression from "browser-image-compression";
import { useEffect, useRef, useState } from "react";
import { Clipboard, Edit, Eye, FolderOpen, Image, Save, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { toast } from "sonner";
import { FieldSeparator } from "@/components/ui/field";


export interface ImageViewerProps {
  thumb?: string;
  src?: string;
  alt?: string;
}

export interface ImageEditorProps {
  thumb?: File;
  src?: File;
  onChange: (file: File | null, thumb: File | null) => void;
}

export function ImageViewer(props: ImageViewerProps) {
  return (
    <div onClick={e => e.stopPropagation()}>
      <Dialog>
        <DialogTrigger asChild>
          <div className="group relative cursor-pointer overflow-hidden rounded-md">
            <img src={props.thumb} alt={props.alt} className="h-auto w-full object-cover" />

            <div className="absolute inset-0 hidden items-center justify-center bg-black/40 group-hover:flex">
              <Eye className="h-5 w-5 text-white" />
            </div>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{props.alt}</DialogTitle>
          </DialogHeader>
          {props.src && <img src={props.src} alt={props.alt} className="w-fit h-fit rounded-md border" />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function ImageEditor({ thumb, src, onChange }: ImageEditorProps) {
  const [thumbFile, setThumbFile] = useState<File | null>(thumb ?? null);
  const [fullResFile, setFullResFile] = useState<File | null>(src ?? null);

  const originalThumbUrl = thumb ? URL.createObjectURL(thumb) : null;
  const previewUrl = thumbFile ? URL.createObjectURL(thumbFile) : null;
  const fullResUrl = fullResFile ? URL.createObjectURL(fullResFile) : null;
  const [isOpen, setIsOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File | null) {
    if (!file)
      return;

    if (!file.type.startsWith("image/")) {
      toast.error("Selected file is not an image.");
      return;
    }

    async function compressor() {
      // Recreate the file so we don't lose access.
      const arrayBuffer = await file!.arrayBuffer();
      file =  new File([arrayBuffer!], file!.name, { type: file!.type, lastModified: file!.lastModified });

      const compressedFullResFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        initialQuality: 0.75,
        fileType: "image/webp",
        useWebWorker: true
      });

      const compressedThumbFile = await imageCompression(file, {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 64,
        initialQuality: 0.75,
        fileType: "image/webp",
        useWebWorker: true
      });

      setFullResFile(compressedFullResFile);
      setThumbFile(compressedThumbFile);
    }

    toast.promise(compressor(), {
      loading: "Compressing image...",
      error: "Failed to compress image."
    });
  }

  function handleRemove() {
    setFullResFile(null);
    setThumbFile(null);
  }

  function saveChanges() {
    onChange(fullResFile, thumbFile);
    setIsOpen(false);
  }

  async function handleUrl(url: string) {
    if(!url || !url.startsWith("http")) {
      toast.error("Invalid URL.");
      return;
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      toast.error("Failed to fetch image from URL.");
      return;
    }

    const blob = await response.blob();

    if (!blob.type.startsWith("image/")) {
      toast.error("URL does not point to an image.");
      return;
    }

    const file = new File([blob], "url-image", { type: blob.type });
    handleFile(file);
  }

  async function handleClipboard() {
    const clipboardItems = await navigator.clipboard.read();

    if (clipboardItems.length === 0) {
      toast.error("Clipboard is empty.");
      return;
    }

    const item = clipboardItems[0];

    const isImage = item.types.some((type) => type.startsWith("image/"));

    if (isImage) {
      const image: Blob = await item.getType(item.types.find((type) => type.startsWith("image/"))!);
      const file = new File([image], "clipboard-image", { type: image.type });
      handleFile(file);
      return;
    }

    const isText = item.types.some((type) => type.startsWith("text/"));

    if (isText) {
      const text = await item.getType("text/plain");
      handleUrl(await text.text());
      return;
    }

    toast.error("No image found in clipboard.");
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];

    if (file) {
      handleFile(file);
    }
  }

  function handlePaste(e: ClipboardEvent) {
    const item = e.clipboardData?.items[0];

    if (!item)
      return;

    if (item.type.startsWith("image/")) {
      const file = item.getAsFile();
      if (file) {
        handleFile(file);
      }

      return;
    }
    
    if (item.type.startsWith("text/")) {
      item.getAsString((text) => {
        handleUrl(text);
      });

      return;
    }

    toast.error("No image found in clipboard.");
  }

  useEffect(() => {
    if (!isOpen) {
      setFullResFile(src ?? null);
      setThumbFile(thumb ?? null);
    }
  }, [isOpen]);

  useEffect(() => {
    window.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("paste", handlePaste);
    }
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        {originalThumbUrl &&
          <div className="group relative cursor-pointer overflow-hidden rounded-md">
            <img src={originalThumbUrl} className="h-auto w-full object-cover" />

            <div className="absolute inset-0 hidden items-center justify-center bg-black/40 group-hover:flex">
              <Edit className="h-5 w-5 text-white" />
            </div>
          </div> ||
          <Tooltip>
            <TooltipTrigger
              onClick={() => fileInputRef.current?.click()}
              className="border-dashed border-1 border-informational cursor-pointer rounded-md p-1 bg-informational/15">
              <Image className="text-informational" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Add image</p>
            </TooltipContent>
          </Tooltip>
        }
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit image</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          {!previewUrl && (
            <div className="flex flex-col gap-2 border-dashed border-1 rounded-md p-4" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
              <Image className="w-16 h-16 text-border mx-auto" />
              <span className="mx-auto text-muted-foreground">Drag an image here</span>

              <div className="flex items-center gap-4 text-muted-foreground">
                <FieldSeparator className="flex-1" />
                <span className="text-sm text-muted-foreground">OR</span>
                <FieldSeparator className="flex-1" />
              </div>
              
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                <FolderOpen className="text-honey-brown" />Pick a file
              </Button>
              <Button variant="outline" onClick={handleClipboard}>
                <Clipboard className="text-honey-brown" />Paste from clipboard
              </Button>
              <Input type="file" accept="image/*" ref={fileInputRef} onChange={(e) => handleFile(e.target.files?.[0] ?? null)} className="hidden" />
            </div>) ||
            (
              <InputGroup>
                <InputGroupInput value={fullResFile?.name ?? ""} readOnly />
                <InputGroupAddon align="inline-end">
                  <Button variant="ghost" onClick={handleRemove}>
                    <Trash2 />
                  </Button>
                </InputGroupAddon>
              </InputGroup>
            )
          }

          {fullResUrl && (
            <>
              <div className="flex flex-row items-center gap-1 flex-wrap">
                <Badge variant="outline">
                  {fullResFile ? (fullResFile.size / 1024).toFixed(2) + " KB" : "N/A"}
                </Badge>
                <Badge variant="outline">
                  {fullResFile ? new Date(fullResFile.lastModified).toLocaleDateString() : "N/A"}
                </Badge>
              </div>

              {fullResUrl && <img src={fullResUrl} alt="Full resolution preview" className="w-fit h-fit rounded-md border" />}
            </>
          )}
        </div>

        <DialogFooter>
          <div className="flex flex-row items-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={saveChanges} disabled={src == fullResFile}><Save /> Save</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}