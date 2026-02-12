import Container from "@/components/ui/container"
import { SearchLoadingState } from "@/components/search-loading-state"

export default function Loading() {
  return (
    <Container>
      <div className="min-h-screen py-12 flex items-center justify-center">
        <SearchLoadingState />
      </div>
    </Container>
  )
}
