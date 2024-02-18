import { CheckIcon } from '@heroicons/react/20/solid'
import { classNames } from '@/app/utils'
import { Badge } from '@/components/ui/badge'

const steps = [
  { name: 'Create account', description: 'Vitae sed mi luctus laoreet.', href: '#', status: 'complete', points: '100'},
  {
    name: 'Profile information',
    description: 'Cursus semper viverra facilisis et et some more.',
    href: '#',
    status: 'current',
    points: '100',
  },
  { name: 'Business information', description: 'Penatibus eu quis ante.', href: '#', status: 'upcoming', points: '100' },
  { name: 'Theme', description: 'Faucibus nec enim leo et.', href: '#', status: 'upcoming', points: '100' },
  { name: 'Preview', description: 'Iusto et officia maiores porro ad non quas.', href: '#', status: 'upcoming', points: '100'},
]

export default function ChallengesList() {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="overflow-hidden">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className={classNames(stepIdx !== steps.length - 1 ? 'pb-10' : '', 'relative')}>
            {step.status === 'complete' ? (
              <>
                {stepIdx !== steps.length - 1 ? (
                  <div className="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 bg-emerald-500" aria-hidden="true" />
                ) : null}
                <a href={step.href} className="group relative flex items-start">
                  <span className="flex h-9 items-center">
                    <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 group-hover:bg-emerald-800">
                      <CheckIcon className="h-5 w-5 text-zinc-900" aria-hidden="true" />
                    </span>
                  </span>
                  <span className="ml-4 flex min-w-0 flex-col w-full">
                    <span className="mb-1 py-px pr-px text-sm font-medium text-zinc-100 flex justify-between w-full">
                        {step.name}
                        {/* <span className="text-sm text-zinc-500">{step.points} points</span> */}
                        <Badge variant="emerald">Claimed</Badge>
                    </span>
                    <span className="text-sm text-zinc-500">{step.description}</span>
                  </span>
                </a>
              </>
            ) : step.status === 'current' ? (
              <>
                {stepIdx !== steps.length - 1 ? (
                  <div className="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 bg-zinc-500" aria-hidden="true" />
                ) : null}
                <a href={step.href} className="group relative flex items-start" aria-current="step">
                  <span className="flex h-9 items-center" aria-hidden="true">
                    <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-emerald-500 bg-zinc-900">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    </span>
                  </span>
                  <span className="ml-4 flex min-w-0 flex-col w-full">
                    <span className="mb-1 py-px pr-px text-sm font-medium text-emerald-500 flex justify-between w-full">
                        {step.name}
                        <span className="text-sm text-zinc-500">{step.points} points</span>
                    </span>
                    <span className="text-sm text-zinc-500">{step.description}</span>
                  </span>
                </a>
              </>
            ) : (
              <>
                {stepIdx !== steps.length - 1 ? (
                  <div className="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 bg-zinc-500" aria-hidden="true" />
                ) : null}
                <a href={step.href} className="group relative flex items-start">
                  <span className="flex h-9 items-center" aria-hidden="true">
                    <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-zinc-500 bg-zinc-900 group-hover:border-gray-400">
                      <span className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-zinc-500" />
                    </span>
                  </span>
                  <span className="ml-4 flex min-w-0 flex-col w-full">
                    <span className="mb-1 py-px pr-px text-sm font-medium text-zinc-500 flex justify-between w-full">
                        {step.name}
                        {/* <span className="text-sm text-zinc-500">{step.points} points</span> */}
                        <Badge variant="blood" title="Finish the previous step to unlock">Locked</Badge>
                    </span>
                    <span className="text-sm text-zinc-500">{step.description}</span>
                  </span>
                </a>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
