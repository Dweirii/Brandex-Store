import { SignIn } from '@clerk/nextjs'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ redirect_url?: string; message?: string }>
}) {
  const params = await searchParams
  const redirectUrl = params.redirect_url
  const message = params.message

  return (
    <div className='mt-10 mb-10 flex flex-col items-center justify-center gap-4'>
      {message && (
        <p className='text-sm font-medium text-muted-foreground bg-muted px-4 py-2.5 rounded-lg border border-border'>
          {message}
        </p>
      )}
      <SignIn
        {...(redirectUrl ? { forceRedirectUrl: redirectUrl } : {})}
      />
    </div>
  )
}
