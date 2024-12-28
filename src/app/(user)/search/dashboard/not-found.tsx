"use client";

export default function SearchNotFound() {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="h-2/4 w-3/4 bg-red-300 rounded-xl items-center justify-center flex">
        <div>
          <h2>An Error Occured!!</h2>
          <p>Page Not Found</p>
        </div>
      </div>
    </div>
  );
}
