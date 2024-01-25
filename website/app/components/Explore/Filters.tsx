import { Fragment, useState } from 'react'
import { Dialog, Disclosure, Menu, Popover, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

import { classNames } from "@/app/utils";

const sortOptions = [
  { name: 'Most Popular', href: '#', current: true },
  { name: 'Best Rating', href: '#', current: false },
  { name: 'Newest', href: '#', current: false },
]
const filters = [
  {
    id: 'category',
    name: 'Category',
    options: [
      { value: 'new-arrivals', label: 'All New Arrivals', checked: false },
      { value: 'tees', label: 'Tees', checked: false },
      { value: 'objects', label: 'Objects', checked: true },
    ],
  },
  {
    id: 'color',
    name: 'Color',
    options: [
      { value: 'white', label: 'White', checked: false },
      { value: 'beige', label: 'Beige', checked: false },
      { value: 'blue', label: 'Blue', checked: false },
    ],
  },
  {
    id: 'sizes',
    name: 'Sizes',
    options: [
      { value: 's', label: 'S', checked: false },
      { value: 'm', label: 'M', checked: false },
      { value: 'l', label: 'L', checked: false },
    ],
  },
]
const activeFilters = [{ value: 'objects', label: 'Objects' }]


export default function Filters() {
  const [open, setOpen] = useState(false)

  return (
      <>
          {/* Mobile filter dialog */}
          <Transition.Root show={open} as={Fragment}>
              <Dialog as="div" className="relative z-40 sm:hidden" onClose={setOpen}>
                  <Transition.Child
                      as={Fragment}
                      enter="transition-opacity ease-linear duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="transition-opacity ease-linear duration-300"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                  >
                      <div className="fixed inset-0 bg-black bg-opacity-25" />
                  </Transition.Child>

                  <div className="fixed inset-0 z-40 flex">
                      <Transition.Child
                          as={Fragment}
                          enter="transition ease-in-out duration-300 transform"
                          enterFrom="translate-x-full"
                          enterTo="translate-x-0"
                          leave="transition ease-in-out duration-300 transform"
                          leaveFrom="translate-x-0"
                          leaveTo="translate-x-full"
                      >
                          <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-zinc-800 py-4 pb-12 shadow-xl">
                              <div className="flex items-center justify-between px-4">
                                  <h2 className="text-lg font-medium text-zinc-100">Filters</h2>
                                  <button type="button" className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-zinc-800 p-2 text-zinc-200" onClick={() => setOpen(false)}>
                                      <span className="sr-only">Close menu</span>
                                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                  </button>
                              </div>

                              {/* Filters */}
                              <form className="mt-4">
                                  {filters.map((section) => (
                                      <Disclosure as="div" key={section.name} className="border-t border-zinc-700/80 px-4 py-6">
                                          {({ open }) => (
                                              <>
                                                  <h3 className="-mx-2 -my-3 flow-root">
                                                      <Disclosure.Button className="flex w-full items-center justify-between bg-zinc-800 px-2 py-3 text-sm text-zinc-200">
                                                          <span className="font-medium text-zinc-100">{section.name}</span>
                                                          <span className="ml-6 flex items-center">
                                                              <ChevronDownIcon className={classNames(open ? "-rotate-180" : "rotate-0", "h-5 w-5 transform")} aria-hidden="true" />
                                                          </span>
                                                      </Disclosure.Button>
                                                  </h3>
                                                  <Disclosure.Panel className="pt-6">
                                                      <div className="space-y-6">
                                                          {section.options.map((option, optionIdx) => (
                                                              <div key={option.value} className="flex items-center">
                                                                  <input
                                                                      id={`filter-mobile-${section.id}-${optionIdx}`}
                                                                      name={`${section.id}[]`}
                                                                      defaultValue={option.value}
                                                                      type="checkbox"
                                                                      defaultChecked={option.checked}
                                                                      className="h-4 w-4 rounded border-zinc-700/80 text-jade-600 focus:ring-jade-500"
                                                                  />
                                                                  <label htmlFor={`filter-mobile-${section.id}-${optionIdx}`} className="ml-3 text-sm text-zinc-500">
                                                                      {option.label}
                                                                  </label>
                                                              </div>
                                                          ))}
                                                      </div>
                                                  </Disclosure.Panel>
                                              </>
                                          )}
                                      </Disclosure>
                                  ))}
                              </form>
                          </Dialog.Panel>
                      </Transition.Child>
                  </div>
              </Dialog>
          </Transition.Root>

          <div className="py-16">
              <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Explore Raffles</h1>
              <p className="mt-4 max-w-xl text-sm text-zinc-400">
                  Dive into a world of unique chances and hidden gems. Find your next big win or the perfect addition to your collection — start
                  exploring today!
              </p>
          </div>

          {/* Filters */}
          <section aria-labelledby="filter-heading">
              <h2 id="filter-heading" className="sr-only">
                  Filters
              </h2>

              <div className="pb-4">
                  <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                      <Menu as="div" className="relative inline-block text-left">
                          <div>
                              <Menu.Button className="group inline-flex justify-center text-sm font-medium text-zinc-200 hover:text-zinc-100">
                                  Sort
                                  <ChevronDownIcon className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-zinc-200 group-hover:text-zinc-500" aria-hidden="true" />
                              </Menu.Button>
                          </div>

                          <Transition
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                          >
                              <Menu.Items className="absolute left-0 z-10 mt-2 w-40 origin-top-left rounded-md bg-zinc-800 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                                  <div className="py-1">
                                      {sortOptions.map((option) => (
                                          <Menu.Item key={option.name}>
                                              {({ active }) => (
                                                  <a href={option.href} className={classNames(option.current ? "font-medium text-zinc-100" : "text-zinc-500", active ? "bg-zinc-800" : "", "block px-4 py-2 text-sm")}>
                                                      {option.name}
                                                  </a>
                                              )}
                                          </Menu.Item>
                                      ))}
                                  </div>
                              </Menu.Items>
                          </Transition>
                      </Menu>

                      <button type="button" className="inline-block text-sm font-medium text-zinc-200 hover:text-zinc-100 sm:hidden" onClick={() => setOpen(true)}>
                          Filters
                      </button>

                      <div className="hidden sm:block">
                          <div className="flow-root">
                              <Popover.Group className="-mx-4 flex items-center divide-x divide-zinc-700/80">
                                  {filters.map((section, sectionIdx) => (
                                      <Popover key={section.name} className="relative inline-block px-4 text-left">
                                          <Popover.Button className="group inline-flex justify-center text-sm font-medium text-zinc-200 hover:text-zinc-100">
                                              <span>{section.name}</span>
                                              {sectionIdx === 0 ? <span className="ml-1.5 rounded bg-zinc-800 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-zinc-200">1</span> : null}
                                              <ChevronDownIcon className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-zinc-200 group-hover:text-zinc-500" aria-hidden="true" />
                                          </Popover.Button>

                                          <Transition
                                              as={Fragment}
                                              enter="transition ease-out duration-100"
                                              enterFrom="transform opacity-0 scale-95"
                                              enterTo="transform opacity-100 scale-100"
                                              leave="transition ease-in duration-75"
                                              leaveFrom="transform opacity-100 scale-100"
                                              leaveTo="transform opacity-0 scale-95"
                                          >
                                              <Popover.Panel className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-zinc-800 p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                  <form className="space-y-4">
                                                      {section.options.map((option, optionIdx) => (
                                                          <div key={option.value} className="flex items-center">
                                                              <input
                                                                  id={`filter-${section.id}-${optionIdx}`}
                                                                  name={`${section.id}[]`}
                                                                  defaultValue={option.value}
                                                                  type="checkbox"
                                                                  defaultChecked={option.checked}
                                                                  className="h-4 w-4 rounded border-zinc-700/80 text-jade-600 focus:ring-jade-500"
                                                              />
                                                              <label htmlFor={`filter-${section.id}-${optionIdx}`} className="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-zinc-100">
                                                                  {option.label}
                                                              </label>
                                                          </div>
                                                      ))}
                                                  </form>
                                              </Popover.Panel>
                                          </Transition>
                                      </Popover>
                                  ))}
                              </Popover.Group>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Active filters */}
              <div className="bg-zinc-800 rounded-xl">
                  <div className="mx-auto max-w-7xl px-4 py-3 sm:flex sm:items-center sm:px-6 lg:px-8">
                      <h3 className="text-sm font-medium text-zinc-500">
                          Filters
                          <span className="sr-only">, active</span>
                      </h3>

                      <div aria-hidden="true" className="hidden h-5 w-px bg-zinc-700/80 sm:ml-4 sm:block" />

                      <div className="mt-2 sm:ml-4 sm:mt-0">
                          <div className="-m-1 flex flex-wrap items-center">
                              {activeFilters.map((activeFilter) => (
                                  <span key={activeFilter.value} className="m-1 inline-flex items-center rounded-full border border-zinc-700/80 bg-zinc-800 py-1.5 pl-3 pr-2 text-sm font-medium text-zinc-100">
                                      <span>{activeFilter.label}</span>
                                      <button type="button" className="ml-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full p-1 text-zinc-200 hover:bg-zinc-800 hover:text-zinc-500">
                                          <span className="sr-only">Remove filter for {activeFilter.label}</span>
                                          <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                              <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                                          </svg>
                                      </button>
                                  </span>
                              ))}
                          </div>
                      </div>
                  </div>
              </div>
          </section>
      </>
  );
}
