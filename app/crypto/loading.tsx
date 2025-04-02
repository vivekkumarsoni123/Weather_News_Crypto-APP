import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      <Skeleton className="h-10 w-64" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="h-[400px] w-full lg:col-span-2" />
        <Skeleton className="h-[400px] w-full" />
      </div>

      <Skeleton className="h-[500px] w-full" />
    </div>
  )
}

