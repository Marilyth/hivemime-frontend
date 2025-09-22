"use client";

interface PostProps {
  onClick?: () => void;
  value: string;
  name: string;
}

export default function HiveMimePickOption({ value, name, onClick }: PostProps) {
  return (
    <div className="flex flex-row hover:text-honey-brown hover:border-honey-brown transition-colors border rounded-md px-2 py-1" onClick={onClick}>
      <span className="w-8 font-light text-gray-500">{value}</span>
      <span>{name}</span>
    </div>
  );
}
