export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-white">

            <div className="w-full overflow-hidden px-6 py-4">
                {children}
            </div>
        </div>
    );
}
