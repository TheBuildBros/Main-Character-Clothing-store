"use client";

export function BagPageSkeleton() {
  return (
    <div
      className="min-h-screen bg-[#F8F6F1] py-10 px-4 sm:px-6 lg:px-8"
      aria-busy="true"
      aria-label="Loading shopping bag"
    >
      <div className="mx-auto max-w-6xl space-y-8 animate-pulse motion-reduce:animate-none">
        <div className="space-y-3">
          <div className="h-3 w-24 bg-[#0B1F3A]/10 rounded" />
          <div className="h-10 w-64 bg-[#0B1F3A]/10 rounded" />
          <div className="h-6 w-72 bg-[#0B1F3A]/10 rounded" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            <div className="h-16 bg-white border border-[#0B1F3A]/10 rounded-sm" />
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-44 bg-white border border-[#0B1F3A]/10 rounded-sm p-5 flex gap-5"
              >
                <div className="w-24 h-32 bg-[#F0EDE6] rounded-sm shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-3 w-28 bg-[#F0EDE6] rounded" />
                  <div className="h-5 w-3/4 bg-[#F0EDE6] rounded" />
                  <div className="h-4 w-1/3 bg-[#F0EDE6] rounded" />
                  <div className="h-9 w-36 bg-[#F0EDE6] rounded mt-4" />
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4">
            <div className="h-96 bg-white border border-[#0B1F3A]/10 rounded-sm p-6 space-y-4">
              <div className="h-3 w-28 bg-[#F0EDE6] rounded" />
              <div className="h-4 w-full bg-[#F0EDE6] rounded" />
              <div className="h-4 w-full bg-[#F0EDE6] rounded" />
              <div className="h-4 w-full bg-[#F0EDE6] rounded" />
              <div className="h-12 w-full bg-[#0B1F3A]/10 rounded mt-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WishlistPageSkeleton() {
  return (
    <div
      className="min-h-screen bg-[#F8F6F1] py-10 px-4 sm:px-6 lg:px-8"
      aria-busy="true"
      aria-label="Loading wishlist"
    >
      <div className="mx-auto max-w-6xl space-y-8 animate-pulse motion-reduce:animate-none">
        <div className="space-y-3">
          <div className="h-3 w-28 bg-[#0B1F3A]/10 rounded" />
          <div className="h-10 w-56 bg-[#0B1F3A]/10 rounded" />
        </div>
        <div className="h-14 bg-white border border-[#0B1F3A]/10 rounded-sm" />
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white border border-[#0B1F3A]/10 rounded-sm overflow-hidden"
            >
              <div className="aspect-[3/4] bg-[#F0EDE6]" />
              <div className="p-4 space-y-3">
                <div className="h-3 w-20 bg-[#F0EDE6] rounded" />
                <div className="h-4 w-full bg-[#F0EDE6] rounded" />
                <div className="h-4 w-1/2 bg-[#F0EDE6] rounded" />
                <div className="h-10 w-full bg-[#0B1F3A]/10 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CheckoutPageSkeleton() {
  return (
    <div
      className="min-h-screen bg-[#F8F6F1] py-10 px-4 sm:px-6 lg:px-8"
      aria-busy="true"
      aria-label="Loading checkout"
    >
      <div className="mx-auto max-w-6xl space-y-8 animate-pulse motion-reduce:animate-none">
        <div className="space-y-3">
          <div className="h-3 w-28 bg-[#0B1F3A]/10 rounded" />
          <div className="h-10 w-64 bg-[#0B1F3A]/10 rounded" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            <div className="h-64 bg-white border border-[#0B1F3A]/10 rounded-sm" />
            <div className="h-16 bg-white border border-[#0B1F3A]/10 rounded-sm" />
            <div className="h-16 bg-white border border-[#0B1F3A]/10 rounded-sm" />
          </div>
          <div className="lg:col-span-4">
            <div className="h-96 bg-white border border-[#0B1F3A]/10 rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
