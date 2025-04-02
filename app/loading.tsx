import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <Skeleton key={i} className="h-[500px] w-full" />
        ))}
    </div>
  )
}

