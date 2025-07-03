import { Clock3 } from "lucide-react"

interface NoResultsProps {
  title?: string
  description?: string
}

const NoResults = ({
  title = "Coming Soon",
  description = "We’re working on adding items to this category. Stay tuned!",
}: NoResultsProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className="relative rounded-full bg-muted p-4">
          <Clock3 className="h-10 w-10 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground max-w-md">{description}</p>
        </div>
      </div>
    </div>
  )
}

export default NoResults
