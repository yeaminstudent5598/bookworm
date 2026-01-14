// lib/skeletons.tsx
'use client';

import React from 'react';

/**
 * Base Skeleton Component
 */
const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse bg-white/5 rounded-lg ${className}`} />
);

/**
 * Book Details Page Skeleton
 */
export const BookDetailsSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-b from-[#0a1410] via-[#081309] to-[#0a1410] p-6 lg:p-12">
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Breadcrumb */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-16" />
        <span className="text-gray-700">/</span>
        <Skeleton className="h-4 w-20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* LEFT: Cover & Stats */}
        <div className="lg:col-span-4 space-y-6">
          {/* Cover Image */}
          <Skeleton className="aspect-[3/4.5] w-full rounded-2xl" />

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Skeleton className="flex-1 h-12 rounded-xl" />
            <Skeleton className="flex-1 h-12 rounded-xl" />
          </div>
        </div>

        {/* RIGHT: Info & Content */}
        <div className="lg:col-span-8 space-y-8">
          {/* Title & Author */}
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4 rounded-lg" />
            <Skeleton className="h-6 w-1/2 rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>

          {/* Shelf Status Card */}
          <div className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-8 rounded-2xl space-y-6 border border-white/10">
            <Skeleton className="h-4 w-24" />
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 rounded-xl" />
              ))}
            </div>
            <div className="space-y-4 pt-4 border-t border-white/10">
              <Skeleton className="h-3 w-full rounded-full" />
              <div className="flex gap-4">
                <Skeleton className="h-12 w-32 rounded-xl" />
                <Skeleton className="h-12 flex-1 rounded-xl" />
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="space-y-6 pt-8 border-t border-white/5">
            <Skeleton className="h-8 w-32" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-4 p-6 rounded-2xl bg-white/[0.03] border border-white/5">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-12 h-12 rounded-lg flex-shrink-0" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-12 w-full rounded-lg" />
                </div>
              ))}
            </div>
          </div>

          {/* Review Form */}
          <div className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-8 rounded-2xl space-y-6 border border-white/10">
            <Skeleton className="h-8 w-40" />
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-10 w-10 rounded-lg" />
              ))}
            </div>
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

/**
 * My Library Page Skeleton
 */
export const LibrarySkeleton = () => (
  <div className="min-h-screen bg-gradient-to-b from-[#0a1410] via-[#081309] to-[#0a1410]">
    {/* Header */}
    <header className="sticky top-0 z-20 border-b border-white/5 backdrop-blur-md bg-[#0a1410]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6">
        <div className="space-y-4">
          {/* Title */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-4 w-full max-w-md" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4 pt-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </header>

    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 md:py-16 space-y-16">
      {/* Currently Reading Section */}
      <div className="space-y-8">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-6 p-6 rounded-2xl bg-white/[0.03] border border-white/5">
              <Skeleton className="w-28 h-40 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-3 w-full rounded-full" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Want to Read Section */}
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex gap-6 overflow-x-auto">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex-shrink-0 w-40 space-y-3">
              <Skeleton className="aspect-[3/4.5] w-full rounded-xl" />
              <div className="space-y-2 px-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Read Section */}
      <div className="space-y-8">
        <Skeleton className="h-8 w-32" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[3/4.5] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <Skeleton key={j} className="h-3 w-3 rounded-full" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  </div>
);

/**
 * Dashboard Page Skeleton
 */
export const DashboardSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-b from-[#0a1410] via-[#081309] to-[#0a1410] p-6 lg:p-10">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-8 border-b border-white/5">
            <div className="space-y-2">
              <Skeleton className="h-10 w-1/2" />
              <Skeleton className="h-4 w-full max-w-md" />
            </div>
            <Skeleton className="h-12 w-12 rounded-2xl" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2 p-8 rounded-3xl bg-white/[0.03] border border-white/5 flex gap-8">
              <Skeleton className="w-32 h-32 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-3 w-full rounded-full" />
              </div>
            </div>
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-40 rounded-3xl" />
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="p-10 rounded-3xl bg-white/[0.03] border border-white/5 space-y-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-64 w-full rounded-lg" />
              </div>
            ))}
          </div>

          {/* Recommendations */}
          <div className="space-y-8 pt-8 border-t border-white/5">
            <div className="flex justify-between items-center">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[3/4.5] w-full rounded-2xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4">
          <div className="bg-white/[0.03] rounded-3xl p-8 border border-white/5 space-y-8">
            <div className="flex justify-between items-center">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>

            <div className="space-y-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-4 pb-8 border-b border-white/5 last:border-0">
                  <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <div className="flex gap-1">
                      {[1, 2, 3].map((j) => (
                        <Skeleton key={j} className="h-3 w-3 rounded-full" />
                      ))}
                    </div>
                    <Skeleton className="h-16 w-full rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
);

/**
 * Books Browse Page Skeleton
 */
export const BooksBrowseSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-b from-[#0a1410] via-[#081309] to-[#0a1410]">
    {/* Header */}
    <header className="sticky top-0 z-20 border-b border-white/5 backdrop-blur-md bg-[#0a1410]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6">
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/3" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </header>

    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 md:py-16">
      {/* Search & Filters */}
      <div className="space-y-4 mb-12">
        <Skeleton className="h-12 w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-[3/4.5] w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-2/3" />
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((j) => (
                  <Skeleton key={j} className="h-3 w-3 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-12">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-10 w-10 rounded-lg" />
        ))}
      </div>
    </main>
  </div>
);


export const TutorialsSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header Section */}
      <div className="mb-16 space-y-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-8">
          <div className="space-y-4 flex-grow">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-6 w-full max-w-xl" />
          </div>

          {/* Search Bar Skeleton */}
          <Skeleton className="h-12 w-full md:w-96 rounded-lg" />
        </div>
      </div>

      {/* Tutorials Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 overflow-hidden flex flex-col h-full"
          >
            {/* Video Thumbnail */}
            <Skeleton className="aspect-video w-full" />

            {/* Content Section */}
            <div className="p-5 space-y-4 flex flex-col flex-grow">
              <div className="space-y-2 flex-grow">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-5/6" />
                
                {/* Description Lines */}
                <div className="space-y-2 pt-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                  <Skeleton className="h-3 w-4/5" />
                </div>
              </div>

              {/* Footer Metadata */}
              <div className="pt-4 border-t border-slate-700">
                <Skeleton className="h-3 w-28" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/**
 * General Page Skeleton
 */
export const PageSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-b from-[#0a1410] via-[#081309] to-[#0a1410] p-6 lg:p-12">
    <div className="max-w-7xl mx-auto space-y-8">
      <Skeleton className="h-12 w-1/2" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-64 rounded-xl" />
        ))}
      </div>
    </div>
  </div>
);