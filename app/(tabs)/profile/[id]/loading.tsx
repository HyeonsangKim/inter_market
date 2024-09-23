export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-center">
            <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gray-300 rounded-full"></div>
            <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
              <div className="h-8 bg-gray-300 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-64 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-32"></div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <div className="w-32 h-10 bg-gray-300 rounded-md"></div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex">
            <div className="w-1/2 py-4 px-1 text-center">
              <div className="h-6 bg-gray-300 rounded w-24 mx-auto"></div>
            </div>
            <div className="w-1/2 py-4 px-1 text-center">
              <div className="h-6 bg-gray-300 rounded w-24 mx-auto"></div>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 rounded-lg p-4">
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
