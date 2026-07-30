const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24">

      <div className="relative w-16 h-16">

        <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>

        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#C9293A] animate-spin"></div>

      </div>

      <h3 className="mt-8 text-xl font-semibold text-slate-800">
        Loading...
      </h3>

      <p className="mt-2 text-slate-500">
        Please wait while we fetch the data.
      </p>

    </div>
  );
};

export default Loading;