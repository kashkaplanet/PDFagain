import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
            <div className="space-y-4 text-center">
                <Skeleton className="h-10 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow border-dashed p-10">
                <div className="flex flex-col items-center justify-center space-y-4">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <div className="space-y-2 text-center w-full max-w-md">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3 mx-auto" />
                    </div>
                </div>
            </div>
        </div>
    )
}

