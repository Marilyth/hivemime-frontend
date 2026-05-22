import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import imageCompression from "browser-image-compression";
import { useEffect, useRef, useState } from "react";
import { Edit, FolderOpen, Image, Save, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";


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
        <img src={props.thumb ?? props.src} alt={props.alt} className="w-full h-auto object-cover rounded-md" />
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

  async function handleFileChange(file: File | null) {
    if (!file) return;

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

  function handleRemove() {
    setFullResFile(null);
    setThumbFile(null);
    fileInputRef.current!.value = "";
  }

  function saveChanges() {
    onChange(fullResFile, thumbFile);
    setIsOpen(false);
  }

  async function handleUrl(url: string) {
    if(!url || !url.startsWith("http"))
      return;
    
    const response = await fetch(url);
    if (!response.ok) return;
    const blob = await response.blob();
    const file = new File([blob], "url-image", { type: blob.type });
    handleFileChange(file);
  }

  async function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const file = Array.from(e.clipboardData?.items ?? [])
      .find((item) => item.kind === "file" && item.type.startsWith("image/"))
      ?.getAsFile()

    if (file) {
      handleFileChange(file);
      return;
    }

    const imageUrl = e.clipboardData?.getData("text/plain") ?? "";
    handleUrl(imageUrl);
  }

  useEffect(() => {
    if (!isOpen) {
      setFullResFile(src ?? null);
      setThumbFile(thumb ?? null);
    }
  }, [isOpen]);

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
            <div className="flex flex-col gap-2">
              <Button className="w-fit" variant="outline" onClick={() => fileInputRef.current?.click()}>
                <FolderOpen className="text-honey-brown" />Pick a file
              </Button>
              <Input placeholder="...or paste a link or image" autoFocus onPaste={handlePaste} onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleUrl(e.currentTarget.value);
                }
              }} />
              <Input type="file" accept="image/*" ref={fileInputRef} onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)} className="hidden" />
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