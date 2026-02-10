import { SignIn } from '@clerk/nextjs'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ redirect_url?: string }>
}) {
  const params = await searchParams
  const redirectUrl = params.redirect_url

  return (
    <div className='mt-10 mb-10 items-center justify-center'>
      <SignIn
        {...(redirectUrl ? { forceRedirectUrl: redirectUrl } : {})}
      />
    </div>
  )
}
