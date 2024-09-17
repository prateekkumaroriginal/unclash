import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css"
import Image from "next/image";
import { FileIcon, X } from "lucide-react";

interface fileUploadProps {
    endpoint: "serverImage" | "messageFile";
    value: string;
    onChange: (url?: string) => void;
}

export const FileUpload = ({ endpoint, value, onChange }: fileUploadProps) => {
    const fileType = value?.split(".").pop();

    if (fileType && ["png", "jpg", "jpeg"].includes(fileType)) {
        return (
            <div className="relative h-20 w-20">
                <Image
                    fill
                    src={value}
                    alt="upload"
                    className="rounded-full"
                />
                <button
                    type="button"
                    onClick={() => { onChange("") }}
                    className="absolute right-0 top-0 p-1 rounded-full shadow-sm text-white bg-red-500"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        )
    }

    if (fileType && fileType === "pdf") {
        return (
            <div className="relative flex items-center p-2 mt-2 rounded-md dark:bg-slate-500/30">
                <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
                <a
                    href={value}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
                >
                    {value}
                </a>
                <button
                    type="button"
                    onClick={() => { onChange("") }}
                    className="absolute -right-2 -top-2 p-1 rounded-full shadow-sm text-white bg-red-500"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        )
    }

    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                onChange(res?.[0].url);
            }}
            onUploadError={(error) => {
                console.log(error);
            }}
        />
    )
}